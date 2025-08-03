import { ActorModel } from '../models/actor.model';
import { CreateModel } from '../models/create.model';
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
}; 