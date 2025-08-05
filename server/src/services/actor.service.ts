import { ActorRepository } from '../repositories/actor.repository';
import { Activity, Actor, CreateActivity } from '../types/activitypub';
import { ActorGraphRepository } from '../graph/repositories/actor';
import { UserNotFoundError } from '../middleware/errorHandler';
import { OutboxRepository } from '../repositories/outbox.repository';
import { ActivityRepository } from '../repositories/activity.repository';

const apiUrl = process.env.BASE_URL;

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
   getFeeds: async (actorId: string,page:number,limit:number): Promise<any[]> => {
    return ActorRepository.getActorInboxCreateItems(actorId,page,limit)
  },
  
  getActorOutboxActivities: async (actorId: string): Promise<Activity[]> => {
    const outboxItems = await OutboxRepository.getActorOutboxItems(actorId);

    const activities = [];

    for (const item of outboxItems) {
      const activity = await ActivityRepository.getActivityById(item.activity);

      if (activity) {
        activities.push(activity);
      }
    }

    return activities;
  },

  getActorsFollowers: async (actorId: string) => {
    if (actorId.startsWith(apiUrl!)) {
      const followerIds = await ActorGraphRepository.getFollowerIds(actorId);
      
      let actors = [];

      for (const followerId of followerIds) {
        if (followerId.startsWith(apiUrl!)) {
          const actor = await ActorRepository.getActorById(followerId);
          actors.push(actor);
        }
        else {
          // External actor
        }
      }

      return actors;
    }
    else {
      // External actor
    }

  },

  getActorsFollowing: async (actorId: string) => {
    if (actorId.startsWith(apiUrl!)) {
      const actor = await ActorRepository.getActorById(actorId);
      if (!actor) {
        throw new UserNotFoundError('The actor was not found')
      }
      
      const followingIds = await ActorGraphRepository.getFollowerIds(actorId);
      
      let actors = [];

      for (const followingId of followingIds) {
        if (followingId.startsWith(apiUrl!)) {
          const actor = await ActorRepository.getActorById(followingId);
          actors.push(actor);
        }
        else {
          // External actor
        }
      }

      return actors;
    }
    else {
      // External actor
    }
  }
}; 