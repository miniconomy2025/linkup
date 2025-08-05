import { Request, Response, NextFunction } from 'express';
import { ActorService } from '../services/actor.service';
import { BadRequestError, NotAuthenticatedError, UserNotFoundError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const apiUrl   = process.env.BASE_URL

export const ActorController = {
  getActorByGoogleId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Actor ID is required');
      }
      const actor = await ActorService.getActorByGoogleId(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found')
      }
      res.status(200).json(actor);
    } catch (error) {
      next(error);
    }
  },

  postActivityToInbox: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

  getUserOutbox: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByGoogleId(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const activities = await ActorService.getActorOutboxActivities(actorId);

      res.status(200).json(activities);
    } catch (error) {
      next(error);
    }
  },
  
  getUserFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = `${apiUrl}/actors/${req.user.googleId}`;

      const followers = await ActorService.getActorsFollowers(actorId);

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  getActorFollowers: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        throw new BadRequestError('Actor ID is required')
      }

      const followers = await ActorService.getActorsFollowers(decodeURIComponent(actorId as string));

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  getFollowersActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }
      
      const actor = await ActorService.getActorByGoogleId(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const followers = await ActorService.getActorsFollowing(actorId);

      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  },

  getUserFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = `${apiUrl}/actors/${req.user.googleId}`;

      const following = await ActorService.getActorsFollowing(actorId);

      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  getActorFollowing: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const actorId = req.query.actorId;

      if (!actorId) {
        throw new BadRequestError('Actor ID is required')
      }

      const following = await ActorService.getActorsFollowing(decodeURIComponent(actorId as string));

      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  getFollowingActivityPub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError('Actor ID is required')
      }

      const actor = await ActorService.getActorByGoogleId(id);
      if (!actor) {
        throw new UserNotFoundError('Actor not found');
      }

      const actorId = actor.id;
      const following = await ActorService.getActorsFollowing(actorId);

      res.status(200).json(following);
    } catch (error) {
      next(error);
    }
  },

  getUserProfile: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      const summary = await ActorService.getActorProfile(user.googleId);

      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }  
  },

  getUserPosts: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user
      const summary = await ActorService.getActorCreateActivities(`${apiUrl}/actors/${user.googleId}`);

      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }  
  }
}; 