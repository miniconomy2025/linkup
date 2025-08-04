import { ActorGraphRepository } from '../graph/repositories/actor';
import { ActorModel } from '../models/actor.model';
import { CreateModel } from '../models/create.model';
import { InboxItemModel } from '../models/inboxitem.model';
import { Actor, CreateActivity, PersonActor } from '../types/activitypub';

export const ActorRepository = {
  getActorByGoogleId: async (googleId: string): Promise<Actor | null> => {
    return ActorModel.findOne({ preferredUsername: googleId }).lean<Actor>().exec();
  },
   getActorById: async (id: string): Promise<Actor | null> => {
    return ActorModel.findOne({ id }).lean<Actor>().exec();
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    const created = new ActorModel(actor);
    await created.save();
    return created.toObject();
  },
   getCreateActivitiesByActor: async (actorId: string): Promise<CreateActivity[]> => {
    return await CreateModel.find({ actor: actorId, type: 'Create' }).lean();
  }, 

  getActorInboxCreateItems: async (actorId: string, page = 1,limit = 10 ): Promise<any> => {
    const skip = (page - 1) * limit;
    
    const inboxItems = await InboxItemModel.find({ actor: actorId }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    const activityIds = inboxItems.map((item) => item.activity);

    const activities = await CreateModel.find({id: { $in: activityIds },}).exec();

    const activityMap = new Map(activities.map((a) => [a.id, a]));
     const ownActivities = await CreateModel
    .find({ actor: actorId })
    .sort({ createdAt: -1 }) 
    .exec();

    const allActivityIds = [
    ...activityIds,
    // ...ownActivities.map(a => a.id)
];
console.log(allActivityIds.length);

const orderedActivities = allActivityIds.map((id) => activityMap.get(id)).filter(Boolean) as typeof activities;

    const results = await Promise.all(
      orderedActivities.map(async (activity) => {
        const liked = await ActorGraphRepository.hasUserLikedPost(
          activity.object.id!,
          actorId
        );
        const actor =  await ActorRepository.getActorById(actorId);
        return { ...activity.toObject(), liked,actor : {name : actor?.name } };
      })
    );

    return results;
  },
}; 