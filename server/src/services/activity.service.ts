import { ActivityObject, CreateActivity, LikeActivity, OutboxItem } from "../types/activitypub";
import { ActivityRepository } from "../repositories/activity.repository";
import { ActorGraphRepository } from "../graph/repositories/actor";
import { OutboxService } from "./outbox.service";

const appUrl = process.env.BASE_URL;

export const ActivityService = {
  makeCreateActivity: async (activityObject: ActivityObject): Promise<CreateActivity> => {
    const activity = ActivityRepository.saveCreateActivity({
      actor: activityObject.attributedTo,
      object: activityObject,
      type: 'Create'
    })

    return activity;
  },

  makeLikeActivity: async (actorId: string, postId: string): Promise<LikeActivity> => {
    const activity = ActivityRepository.saveLikeActivity({
      actor: actorId,
      object: postId,
      type: 'Like'
    })

    return activity;
  },

  likePost: async (postId: string, googleId: string): Promise<LikeActivity> => {
    const actorId = `${appUrl}/actors/${googleId}`;

    await ActorGraphRepository.createLikeForPost(postId, actorId);
    
    const activity = await ActivityService.makeLikeActivity(actorId, postId);
    
    const outboxItem = await OutboxService.addActivityToOutbox(activity);
    
    // Fanout to inboxes

    return activity;
  },
  
}; 