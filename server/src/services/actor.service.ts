import { ActorRepository } from '../repositories/actor.repository';
import { Actor, CreateActivity } from '../types/activitypub';
import { ActorGraphRepository } from '../graph/repositories/actor';

export const ActorService = {
  getActorByGoogleId: async (googleId: string): Promise<Actor | null> => {
    const actor = await ActorRepository.getActorByGoogleId(googleId);
    return actor;
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    return ActorRepository.createActor(actor);
  },
  getActorProfile: async (preferredUsername: string) => {
    const actor = await ActorRepository.getActorByGoogleId(preferredUsername);
    const activitySummary = await ActorGraphRepository.getActivitySummary(actor?.id || "");
    return {...actor, ...activitySummary};
  },
  getActorCreateActivities: async (actorId: string): Promise<CreateActivity[]> => {
    return ActorRepository.getCreateActivitiesByActor(actorId);
  },
}; 