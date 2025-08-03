import { ActorRepository } from '../repositories/actor.repository';
import { Actor, CreateActivity } from '../types/activitypub';
import { ActorGraphRepository } from '../graph/repositories/actor';

export const ActorService = {
  getActorById: async (id: string): Promise<Actor | null> => {
    const actor = await ActorRepository.getActorById(id);
    return actor;
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    return ActorRepository.createActor(actor);
  },
  getActorProfile: async (preferredUsername: string) => {
    const actor = await ActorRepository.getActorById(preferredUsername);
    const activitySummary = await ActorGraphRepository.getActivitySummary(actor?.id || "");
    return {...actor, ...activitySummary};
  },
  getActorCreateActivities: async (actorId: string): Promise<CreateActivity[]> => {
    return ActorRepository.getCreateActivitiesByActor(actorId);
  },
}; 