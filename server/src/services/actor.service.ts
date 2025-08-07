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
  getActorByUserName: async (userName: string): Promise<Actor | null> => {
    const actor = await ActorRepository.getActorByUserName(userName);
    return actor;
  },
   createActor: async (actor: Actor): Promise<Actor> => {
    return await ActorRepository.createActor(actor);
  },
  getActorProfileByUserName: async (userName: string) => {
    const actor = await ActorRepository.getActorByUserName(userName);
    const activitySummary = await ActorGraphRepository.getActivitySummary(actor?.id || "");
    return {...actor, ...activitySummary};
  },
  getActorCreateActivities: async (actorId: string): Promise<CreateActivity[]> => {
    return await ActorRepository.getCreateActivitiesByActor(actorId);
  },
   getFeeds: async (actorId: string,page:number,limit:number): Promise<any[]> => {
    return await ActorRepository.getActorInboxCreateItems(actorId,page,limit)
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
   getActorProfileById : async (id: string, loggedInActorId :string) => {
    const actor = await ActorRepository.getActorById(id);
    const activitySummary = await ActorGraphRepository.getActivitySummary(actor?.id || "");
   

    const isFollowing = await ActorGraphRepository.hasUserFollowedActor(loggedInActorId,id);
      

    return {...actor, ...activitySummary, isFollowing };
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
      
      const followingIds = await ActorGraphRepository.getFollowingIds(actorId) 
      
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