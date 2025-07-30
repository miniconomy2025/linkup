import { Activity, CreateActivity, OutboxItem } from "../types/activitypub";
import { ActivityRepository } from "../repositories/activity.repository";
import { ActivityObjectRepository } from "../repositories/activityObject.repository";
import { OutboxRepository } from "../repositories/outbox.repository";

const saveActivityInOutbox = async (activity: Activity): Promise<OutboxItem> => {
  const outboxItem: OutboxItem = {
    activity: activity.id!,
    actor: activity.actor
  };

  await OutboxRepository.addItem(outboxItem);

  return outboxItem;
};

export const ActivityService = {
  handleCreateActivity: async (createActivity: CreateActivity): Promise<CreateActivity> => {
    let activityObject = createActivity.object;
    switch (activityObject.type) {
      case 'Note':
        activityObject = await ActivityObjectRepository.createNote(activityObject);
        break;
      case 'Image':
        activityObject = await ActivityObjectRepository.createImage(activityObject);
        break;
      case 'Video':
        activityObject = await ActivityObjectRepository.createVideo(activityObject);
        break;
      default:
        throw new Error('Not an accepted activity type');
    }
    createActivity.object = activityObject;

    createActivity = await ActivityRepository.saveCreateActivity(createActivity);
    
    await saveActivityInOutbox(createActivity);

    // TODO: fanout to inboxes

    return createActivity;
  },

//   handleFollowActivity: async (activity: Activity): Promise<Activity> => {
    
//   },

//   handleLikeActivity: async (activity: Activity): Promise<Activity> => {

//   },

//   handleUndoActivity: async (activity: Activity): Promise<Activity> => {

//   },

}; 