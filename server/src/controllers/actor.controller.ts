import { Request, Response, NextFunction } from 'express';
import { ActorService } from '../services/actor.service';
import { BadRequestError, NotAuthenticatedError, UserNotFoundError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { InboxService } from '../services/inbox.service';
import { ActorGraphRepository } from '../graph/repositories/actor';
import { ExternalActivityRepository } from '../repositories/external.activity.repository';
import { ActivityService } from '../services/activity.service';

const apiUrl = process.env.BASE_URL

export const ActorController = {
getActorByUsername: async (req: Request, res: Response, next: NextFunction) => {
  console.log('🎭 getActorByUsername - START', { id: req.params.id });
  try {
    const { id } = req.params;
    
    if (!id) {
      console.log('❌ getActorByUsername - ERROR: Actor ID is required');
      throw new BadRequestError('Actor ID is required');
    }

    const actor = await ActorService.getActorByUserName(id);
    if (!actor) {
      console.log('❌ getActorByUsername - ERROR: Actor not found', { id });
      throw new UserNotFoundError('Actor not found');
    }

    // Create comprehensive ActivityPub actor object matching the example
    const actorWithKey = {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
        "https://w3id.org/security/data-integrity/v1",
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/multikey/v1",
        {
          "alsoKnownAs": {
            "@id": "as:alsoKnownAs",
            "@type": "@id"
          },
          "manuallyApprovesFollowers": "as:manuallyApprovesFollowers",
          "movedTo": {
            "@id": "as:movedTo",
            "@type": "@id"
          },
          "toot": "http://joinmastodon.org/ns#",
          "Emoji": "toot:Emoji",
          "featured": {
            "@id": "toot:featured",
            "@type": "@id"
          },
          "featuredTags": {
            "@id": "toot:featuredTags",
            "@type": "@id"
          },
          "discoverable": "toot:discoverable",
          "suspended": "toot:suspended",
          "memorial": "toot:memorial",
          "indexable": "toot:indexable",
          "schema": "http://schema.org#",
          "PropertyValue": "schema:PropertyValue",
          "value": "schema:value",
          "misskey": "https://misskey-hub.net/ns#",
          "_misskey_followedMessage": "misskey:_misskey_followedMessage",
          "isCat": "misskey:isCat"
        }
      ],
      id: actor.id,
      type: "Person",
      discoverable: true,
      indexable: true,
      inbox: actor.inbox,
      followers: actor.followers,
      following: actor.following,
      ...(actor.icon && {
        icon: {
          type: "Image",
          mediaType: "image/jpeg",
          url: actor.icon.url
        }
      }),
      manuallyApprovesFollowers: false,
      name: actor.name,
      outbox: actor.outbox,
      preferredUsername: actor.preferredUsername,
      summary: ""
    };

    // No need to remove undefined fields since we use conditional spreading

    // Set proper ActivityPub headers
    res.setHeader('Content-Type', 'application/activity+json; profile="https://www.w3.org/ns/activitystreams"');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Vary', 'Accept');

    res.status(200).json(actorWithKey);
    console.log('✅ getActorByUsername - END', { id, actorId: actor.id });
    
  } catch (error) {
    console.error('💥 getActorByUsername - CATCH ERROR:', error);
    next(error);
  }
},

  postActivityToInbox: async (req: Request, res: Response, next: NextFunction) => {
    console.log('📥 postActivityToInbox - START', { id: req.params.id, activityType: req.body?.type });
    try {
      const { id } = req.params;
      if (!id) {
        console.log('❌ postActivityToInbox - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required');
      }
      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        console.log('❌ postActivityToInbox - ERROR: Actor not found', { id });
        throw new UserNotFoundError('Actor not found')
      }

      const activity = req.body;

      if (!activity) {
        console.log('❌ postActivityToInbox - ERROR: Activity is required');
        throw new BadRequestError('Activity is required');
      }

      await InboxService.addActivityToInbox(activity, actor.id!);

      await ExternalActivityRepository.createExternalActivity(activity);

      if (activity.type == 'Follow') {
        await ActorGraphRepository.createFollowActorActivity(activity.actor.id, actor.id);
      }
      else if (activity.type == 'Like') {
        const activityOnOurSide = ActivityService.getActivitytById(activity.object);
        if (activityOnOurSide) {
          await ActorGraphRepository.createLikeForPost(((await activityOnOurSide).object as any).id, activity.actor);
        }
        else {
          await ActorGraphRepository.createLikeForPost(activity.object, activity.actor);
        }
        
      }
      else if (activity.type == 'Undo') {
        await ActorGraphRepository.removeFollowActor(activity.actor.id, actor.id);
      }

      res.status(200).json({message: 'Activity received in inbox successfully'})
      console.log('✅ postActivityToInbox - END', { id, activityType: activity.type, actorId: actor.id });
    } catch (error) {
      console.error('💥 postActivityToInbox - CATCH ERROR:', error);
      next(error);
    }
  },

  getUserOutbox: async (req: Request, res: Response, next: NextFunction) => {
    console.log('📤 getUserOutbox - START', { id: req.params.id });
    try {
      const id = req.params.id;

      if (!id) {
        console.log('❌ getUserOutbox - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        console.log('❌ getUserOutbox - ERROR: Actor not found', { id });
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const activities = await ActorService.getActorOutboxActivities(actorId);

      const orderedActivities = 
        activities.sort((a, b) => {
          const dateA = a.published ? new Date(a.published).getTime() : 0;
          const dateB = b.published ? new Date(b.published).getTime() : 0;
          return dateB - dateA;
        });

      res.setHeader('Content-Type', 'application/activity+json');
      res.status(200).json({
        "@context": "https://www.w3.org/ns/activitystreams",
        "summary": `${actor.name}'s outbox`,
        "type": "OrderedCollection",
        "totalItems": activities.length,
        "orderedItems": orderedActivities
      });
      console.log('✅ getUserOutbox - END', { id, actorId, activitiesCount: activities.length });
    } catch (error) {
      console.error('💥 getUserOutbox - CATCH ERROR:', error);
      next(error);
    }
  },
  
  getUserFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('👥 getUserFollowers - START', { userName: req.user?.userName });
    try {
      const actorId = `${apiUrl}/actors/${req.user.userName}`;

      const followers = await ActorService.getActorsFollowers(actorId);

      res.status(200).json(followers);
      console.log('✅ getUserFollowers - END', { actorId, followersCount: followers?.length });
    } catch (error) {
      console.error('💥 getUserFollowers - CATCH ERROR:', error);
      next(error);
    }
  },

  getActorFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('👥 getActorFollowers - START', { actorId: req.query.actorId });
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        console.log('❌ getActorFollowers - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required')
      }

      const followers = await ActorService.getActorsFollowers(decodeURIComponent(actorId as string));

      res.status(200).json(followers);
      console.log('✅ getActorFollowers - END', { actorId, followersCount: followers?.length });
    } catch (error) {
      console.error('💥 getActorFollowers - CATCH ERROR:', error);
      next(error);
    }
  },

  getFollowersActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    console.log('👥 getFollowersActivityPub - START', { id: req.params.id });
    try {
      const id = req.params.id;

      if (!id) {
        console.log('❌ getFollowersActivityPub - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required')
      }
      
      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        console.log('❌ getFollowersActivityPub - ERROR: Actor not found', { id });
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const followers = await ActorService.getActorsFollowing(actorId);

      res.setHeader('Content-Type', 'application/activity+json');
      res.status(200).json({
        "@context": "https://www.w3.org/ns/activitystreams",
        "summary": `${actor.name}'s followers`,
        "type": "OrderedCollection",
        "totalItems": followers ? followers.length : 0,
        "orderedItems": followers
      });
      console.log('✅ getFollowersActivityPub - END', { id, actorId, followersCount: followers?.length });
    } catch (error) {
      console.error('💥 getFollowersActivityPub - CATCH ERROR:', error);
      next(error);
    }
  },

  getUserFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('👤 getUserFollowing - START', { userName: req.user?.userName });
    try {
      const actorId = `${apiUrl}/actors/${req.user.userName}`;

      const following = await ActorService.getActorsFollowing(actorId);

      res.status(200).json(following);
      console.log('✅ getUserFollowing - END', { actorId, followingCount: following?.length });
    } catch (error) {
      console.error('💥 getUserFollowing - CATCH ERROR:', error);
      next(error);
    }
  },

  getActorFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log('👤 getActorFollowing - START', { actorId: req.query.actorId });
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        console.log('❌ getActorFollowing - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required')
      }

      const following = await ActorService.getActorsFollowing(decodeURIComponent(actorId as string));

      res.status(200).json(following);
      console.log('✅ getActorFollowing - END', { actorId, followingCount: following?.length });
    } catch (error) {
      console.error('💥 getActorFollowing - CATCH ERROR:', error);
      next(error);
    }
  },

  getFollowingActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    console.log('👤 getFollowingActivityPub - START', { id: req.params.id });
    try {
      const id = req.params.id;

      if (!id) {
        console.log('❌ getFollowingActivityPub - ERROR: Actor ID is required');
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        console.log('❌ getFollowingActivityPub - ERROR: Actor not found', { id });
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const following = await ActorService.getActorsFollowing(actorId);

      res.setHeader('Content-Type', 'application/activity+json');
      res.status(200).json({
        "@context": "https://www.w3.org/ns/activitystreams",
        "summary": `${actor.name}'s following`,
        "type": "OrderedCollection",
        "totalItems": following ? following.length : 0,
        "orderedItems": following
      });
      console.log('✅ getFollowingActivityPub - END', { id, actorId, followingCount: following?.length });
    } catch (error) {
      console.error('💥 getFollowingActivityPub - CATCH ERROR:', error);
      next(error);
    }
  },

  getUserProfile: async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    console.log('👤 getUserProfile - START', { userName: req.user?.userName });
    try {
      const user = req.user;
      if(user){
         const summary = await ActorService.getActorProfileByUserName(user.userName);
          console.log('✅ getUserProfile - END', { userName: user.userName });
          return res.status(200).json(summary);
      }
      else{
        console.log('❌ getUserProfile - ERROR: User not authenticated');
        res.status(401).json({ message: 'User not authenticated' });
      }
    } catch (error) {
      console.error('💥 getUserProfile - CATCH ERROR:', error);
    }
  },
  getUserPosts: async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    console.log('📝 getUserPosts - START', { actorId: req.query.actorId });
    try {
      const actorId = req.query.actorId as string;
      if (!actorId) {
        console.log('❌ getUserPosts - ERROR: Actor id is required');
        throw new BadRequestError("Actor id is required");
      }
      if (actorId.includes(process.env.BASE_URL!)) {
        const posts = await ActorService.getActorCreateActivities(actorId);
        res.status(200).json(posts);
        console.log('✅ getUserPosts - END (local)', { actorId, postsCount: posts?.length });
      } else {
        // some people need /outbox?cursor=1
        const responseOutbox = await fetch(`${actorId}/outbox`, {
          headers: {
            Accept: "application/activity+json",
          },
        });

        // const responseJson = await responseOutbox.json();
        // const responseOutboxFirst = await fetch(responseJson.first, {
        //   headers: {
        //     Accept: "application/activity+json",
        //   },
        // });

        // Test because cindis posts are local
        // const responseOutboxTest = await fetch(`${actorId}/outbox?cursor=1`, {
        //   headers: {
        //     Accept: "application/activity+json",
        //   },
        // });
        
        if (!responseOutbox.ok) {
          console.log('❌ getUserPosts - ERROR: Failed to fetch remote outbox', { 
            actorId, 
            status: responseOutbox.status, 
            statusText: responseOutbox.statusText 
          });
          throw new Error(
            `Failed to fetch remote outbox: ${responseOutbox.statusText}`
          );
        }

        const data = await responseOutbox.json();
        
        if (!data.orderedItems) {
          console.log('❌ getUserPosts - ERROR: Failed to fetch posts - no orderedItems', { actorId });
          throw new Error(
            `Failed to fetch posts`
          );
        };

        const posts = data.orderedItems;
        res.status(200).json(posts);
        console.log('✅ getUserPosts - END (remote)', { actorId, postsCount: posts?.length });

        // const remoteOutbox = await response.json();
        // res.status(200).json(remoteOutbox);
      }
    } catch (error) {
      console.error('💥 getUserPosts - CATCH ERROR:', error);
      res.status(500).json({ error: "Failed to retrieve posts" });
    }
  },
  getMyPosts: async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    console.log('📝 getMyPosts - START', { userName: req.user?.userName });
    try {
      const user = req.user;
      const summary = await ActorService.getActorCreateActivities(
        `${apiUrl}/actors/${user.userName}`
      );
      console.log('✅ getMyPosts - END', { userName: user.userName, postsCount: summary?.length });
      return res.status(200).json(summary);
    } catch (error) {
      console.error('💥 getMyPosts - CATCH ERROR:', error);
    }
  },
  getActorProfileById: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    console.log('👤 getActorProfileById - START', { actorId: req.query.actorId, userName: req.user?.userName });
    try {
      const actorId = req.query.actorId as string;
      const user = req.user;
      if (!user) {
        console.log('❌ getActorProfileById - ERROR: User not authenticated');
        throw new NotAuthenticatedError("Üser not authenticared");
      } else if (!actorId) {
        console.log('❌ getActorProfileById - ERROR: actor id is required');
        throw new BadRequestError("actor id is required");
      } else {
        let actor;
        const loggedInActorId = `${process.env.BASE_URL}/actors/${user.userName}`;
        if (actorId.includes(process.env.BASE_URL!)) {
          actor = await ActorService.getActorProfileById(
            actorId,
            loggedInActorId
          );
          console.log('✅ getActorProfileById - END (local)', { actorId, loggedInActorId });
        } else {
          const response = await fetch(`${actorId}`, {
            headers: {
              Accept: "application/activity+json",
            },
          });
          
          const isFollowing = await ActorGraphRepository.hasUserFollowedActor(loggedInActorId, actorId);

          const actorJson = await response.json();

          const actorFollowing = await fetch(`${actorId}/following`, {
            headers: {
              Accept: "application/activity+json",
            },
          });

          const dataFollowing = await actorFollowing.json();

          const actorFollowers = await fetch(`${actorId}/followers`, {
            headers: {
              Accept: "application/activity+json",
            },
          });

          const dataFollowers = await actorFollowers.json();

          actor = {
            name: actorJson.name,
            preferredUsername: actorJson.preferredUsername,
            icon: {
              url: actorJson?.icon?.url
            },
            isFollowing,
            followersCount: dataFollowers?.orderedItems?.length || 0,
            followingCount: dataFollowing?.orderedItems?.length || 0
          };
          console.log('✅ getActorProfileById - END (remote)', { 
            actorId, 
            loggedInActorId, 
            isFollowing,
            followersCount: actor.followersCount,
            followingCount: actor.followingCount
          });
        }
        res.status(200).json(actor);
      }
    } catch (error) {
      console.error('💥 getActorProfileById - CATCH ERROR:', error);
      next(error);
    }
  },
};