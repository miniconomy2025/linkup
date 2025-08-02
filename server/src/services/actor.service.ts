import { ActorRepository } from '../repositories/actor.repository';
import { Actor } from '../types/activitypub';

export const ActorService = {
  getActorById: async (id: string): Promise<Actor | null> => {
    const actor = await ActorRepository.getActorById(id);
    return actor;
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    return ActorRepository.createActor(actor);
  },
}; 