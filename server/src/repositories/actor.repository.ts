import { ActorGraphRepository } from '../graph/repositories/actor';
import { ActorModel } from '../models/actor.model';
import { CreateModel } from '../models/create.model';
import { InboxItemModel } from '../models/inboxitem.model';
import { Actor, CreateActivity } from '../types/activitypub';

export const ActorRepository = {
  getActorByGoogleId: async (googleId: string): Promise<Actor | null> => {
    return ActorModel.findOne({ preferredUsername: googleId }).lean<Actor>().exec();
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    const created = new ActorModel(actor);
    await created.save();
    return created.toObject();
  },
   getCreateActivitiesByActor: async (actorId: string): Promise<CreateActivity[]> => {
    return await CreateModel.find({ actor: actorId, type: 'Create' }).lean();
  }, 

  getActorInboxCreateItems: async (actorId: string): Promise<(CreateActivity & { liked: boolean })[]> => {
    const inboxItems = await InboxItemModel.find({ actor: actorId }).sort({ createdAt: -1 }).exec();
    const activityIds = inboxItems.map((item) => item.activity);

    const activities = await CreateModel.find({id: { $in: activityIds },}).exec();

    const activityMap = new Map(activities.map((a) => [a.id, a]));

    const orderedActivities = activityIds.map((id) => activityMap.get(id)).filter(Boolean) as typeof activities;

    const results = await Promise.all(
      orderedActivities.map(async (activity) => {
        const liked = await ActorGraphRepository.hasUserLikedPost(
          activity.object.id!,
          actorId
        );
        return { ...activity.toObject(), liked };
      })
    );

    return results;
  },
}; 