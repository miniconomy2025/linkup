import { Activity, ActivityObject, CreateActivity, FollowActivity, LikeActivity, OutboxItem, UndoActivity } from "../types/activitypub";
import { ActivityRepository } from "../repositories/activity.repository";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { OutboxService } from "./outbox.service";
import { ActivityNotFoundError, BadRequestError, RequestConflict } from "../middleware/errorHandler";
import { InboxService } from "./inbox.service";
import { ActivityObjectService } from "./activityObject.service";

const apiUrl = process.env.BASE_URL;

export const ActivityService = {
  getActivitytById: async (activityId: string): Promise<Activity> => {
    if (activityId.startsWith(apiUrl!)) {
      const activity = await ActivityRepository.getActivityById(activityId);
  
      return activity;
    }
    else {
      throw new ActivityNotFoundError();
    }
  },

  makeCreateActivity: async (activityObject: ActivityObject): Promise<CreateActivity> => {
    const activity = await ActivityRepository.saveCreateActivity({
      actor: activityObject.attributedTo,
      object: activityObject,
      type: 'Create'
    })

    return activity;
  },

  makeLikeActivity: async (actorId: string, postId: string): Promise<LikeActivity> => {
    const activity = await ActivityRepository.saveLikeActivity({
      actor: actorId,
      object: postId,
      type: 'Like'
    })

    return activity;
  },

  likePost: async (postId: string, googleId: string): Promise<LikeActivity> => {
    const actorId = `${apiUrl}/actors/${googleId}`;

    if (await ActorGraphRepository.hasUserLikedPost(postId, actorId)) {
      throw new RequestConflict('User has already liked this post');
    }

    await ActorGraphRepository.createLikeForPost(postId, actorId);
    
    const activity = await ActivityService.makeLikeActivity(actorId, postId);
    
    const _outboxItem = await OutboxService.addActivityToOutbox(activity);
    
    const post = await ActivityObjectService.getPostById(postId);
    const postActorId = post.attributedTo;

    await InboxService.addActivityToInbox(activity, postActorId);

    return activity;
  },

  makeFollowActorActivity: async (actorId: string, followedActorId: string): Promise<FollowActivity> => {
    const activity = await ActivityRepository.saveFollowActivity({
      actor: actorId,
      object: followedActorId,
      type: "Follow",
    });
    return activity;
  },

  followActor: async (followerId: string, followedActorId: string ): Promise<FollowActivity> => {
    if (await ActorGraphRepository.hasUserFollowedActor(followerId, followedActorId)) {
      throw new RequestConflict('User is already following this user');
    }

    await ActorGraphRepository.createFollowActorActivity(
      followerId,
      followedActorId
    );

    const activity = await ActivityService.makeFollowActorActivity(
      followerId,
      followedActorId
    );

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.addActivityToInbox(activity, followedActorId);

    return activity;
  },

  makeUndoFollowActivity: async (actorId: string, followedActorId: string): Promise<UndoActivity> => {
    const followActivity = await ActivityRepository.getFollowActivityByActorAndObject(actorId, followedActorId);

    if (!followActivity) {
      throw new RequestConflict('User is not following this user');
    }

    const activity = await ActivityRepository.saveUndoActivity({
      actor: actorId,
      type: 'Undo',
      object: followActivity
    });

    return activity;
  },

  unfollowActor: async (followerId: string, followedActorId: string ): Promise<UndoActivity> => {
    if (!await ActorGraphRepository.hasUserFollowedActor(followerId, followedActorId)) {
      throw new RequestConflict('User is not following this user');
    }

    await ActorGraphRepository.removeFollowActor(followerId, followedActorId);

    const activity = await ActivityService.makeUndoFollowActivity(followerId, followedActorId);

    const _outboxItem = await OutboxService.addActivityToOutbox(activity);

    await InboxService.addActivityToInbox(activity, followedActorId);
    
    return activity
  }
};
