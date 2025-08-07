import { Request, Response, NextFunction } from 'express';
import { ActorService } from '../services/actor.service';
import { BadRequestError, NotAuthenticatedError, UserNotFoundError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { InboxService } from '../services/inbox.service';
import { ActorGraphRepository } from '../graph/repositories/actor';

const apiUrl = process.env.BASE_URL

export const ActorController = {
  getActorByUsername: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Actor ID is required');
      }
      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found')
      }

      const publicKeyPem = process.env.USER_PUBLIC_KEY_PEM;
      console.log(publicKeyPem);

      const actorWithKey = {
        ...actor,
        publicKey: {
          id: `${actor.id}#main-key`,
          owner: actor.id,
          publicKeyPem: publicKeyPem
        }
      };

      res.setHeader('Content-Type', 'application/activity+json');
      res.status(200).json(actorWithKey);
    } catch (error) {
      next(error);
    }
  },

  postActivityToInbox: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Actor ID is required');
      }
      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found')
      }

      const activity = req.body.activity;

      if (!activity) {
        throw new BadRequestError('Activity is required');
      }

      await InboxService.addActivityToInbox(activity, actor.id!);


      res.status(200).json({message: 'Activity received in inbox successfully'})
    } catch (error) {
      next(error);
    }
  },

  getUserOutbox: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
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
    } catch (error) {
      next(error);
    }
  },
  
  getUserFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = `${apiUrl}/actors/${req.user.userName}`;

      const followers = await ActorService.getActorsFollowers(actorId);

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  getActorFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        throw new BadRequestError('Actor ID is required')
      }

      const followers = await ActorService.getActorsFollowers(decodeURIComponent(actorId as string));

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  getFollowersActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }
      
      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
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
    } catch (error) {
      next(error);
    }
  },

  getUserFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = `${apiUrl}/actors/${req.user.userName}`;

      const following = await ActorService.getActorsFollowing(actorId);

      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  getActorFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        throw new BadRequestError('Actor ID is required')
      }

      const following = await ActorService.getActorsFollowing(decodeURIComponent(actorId as string));

      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  getFollowingActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByUserName(id);
      if (!actor) {
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
    } catch (error) {
      next(error);
    }
  },

  getUserProfile: async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    if(user){
       const summary = await ActorService.getActorProfileByUserName(user.userName);
        return res.status(200).json(summary);
    }
    else{
      res.status(401).json({ message: 'User not authenticated' });
    }
  },
  getUserPosts: async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    try {
      const actorId = req.query.actorId as string;
      if (!actorId) {
        throw new BadRequestError("Actor id is required");
      }
      if (actorId.includes(process.env.BASE_URL!)) {
        const posts = await ActorService.getActorCreateActivities(actorId);
        res.status(200).json(posts);
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
          throw new Error(
            `Failed to fetch remote outbox: ${responseOutbox.statusText}`
          );
        }

        const data = await responseOutbox.json();
        
        if (!data.orderedItems) {
          throw new Error(
            `Failed to fetch posts`
          );
        };

        const posts = data.orderedItems;
        res.status(200).json(posts);

        // const remoteOutbox = await response.json();
        // res.status(200).json(remoteOutbox);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve posts" });
    }
  },
  getMyPosts: async (
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) => {
    const user = req.user;
    const summary = await ActorService.getActorCreateActivities(
      `${apiUrl}/actors/${user.userName}`
    );
    return res.status(200).json(summary);
  },
  getActorProfileById: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const actorId = req.query.actorId as string;
      const user = req.user;
      if (!user) {
        throw new NotAuthenticatedError("Üser not authenticared");
      } else if (!actorId) {
        throw new BadRequestError("actor id is required");
      } else {
        let actor;
        const loggedInActorId = `${process.env.BASE_URL}/actors/${user.userName}`;
        if (actorId.includes(process.env.BASE_URL!)) {
          actor = await ActorService.getActorProfileById(
            actorId,
            loggedInActorId
          );
        } else {
          const response = await fetch(`${actorId}`, {
            headers: {
              Accept: "application/activity+json",
            },
          });
          
          const isFollowing = await ActorGraphRepository.hasUserFollowedActor(loggedInActorId,actorId);

          const actorJson = await response.json();

          actor = {
            name: actorJson.name,
            preferredUsername: actorJson.preferredUsername,
            icon: {
              url: actorJson?.icon?.url
            },
            isFollowing
          };
        }
        res.status(200).json(actor);
      }
    } catch (error) {
      next(error);
    }
  },
};
