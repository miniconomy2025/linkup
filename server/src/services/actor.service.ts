import { ActorRepository } from '../repositories/actor.repository';
import { Actor } from '../types/activitypub';
import { UserNotFoundError } from '../middleware/errorHandler';

export const ActorService = {
  getActorById: async (id: string): Promise<Actor> => {
    const actor = await ActorRepository.getActorById(id);
    if (!actor) {
      throw new UserNotFoundError(`Actor with id ${id} not found`);
    }
    return actor;
  },
}; 