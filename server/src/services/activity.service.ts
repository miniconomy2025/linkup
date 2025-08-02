import { ActivityObject, CreateActivity, OutboxItem } from "../types/activitypub";
import { ActivityRepository } from "../repositories/activity.repository";

export const ActivityService = {
  makeCreateActivity: async (activityObject: ActivityObject): Promise<CreateActivity> => {
    const activity = ActivityRepository.saveCreateActivity({
      actor: activityObject.attributedTo,
      object: activityObject,
      type: 'Create'
    })

    return activity;
  },
  
}; 