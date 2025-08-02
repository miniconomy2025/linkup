import { ActorRepository } from '../repositories/actor.repository';
import { Actor } from '../types/activitypub';
import { UserNotFoundError } from '../middleware/errorHandler';

export const ActorService = {
  getActorById: async (id: string): Promise<Actor | null> => {
    const actor = await ActorRepository.getActorById(id);
    return actor;
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    return ActorRepository.createActor(actor);
  },
}; 