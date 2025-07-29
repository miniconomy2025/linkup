import { ActorModel } from '../models/actor.model';
import { Actor } from '../types/activitypub';

export const ActorRepository = {
  getActorById: async (id: string): Promise<Actor | null> => {
    return ActorModel.findOne({ id }).lean<Actor>().exec();
  },
}; 