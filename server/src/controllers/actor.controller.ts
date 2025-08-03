import { Request, Response, NextFunction } from 'express';
import { ActorService } from '../services/actor.service';
import { BadRequestError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const ActorController = {
  getActorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Actor ID is required');
      }
      const actor = await ActorService.getActorById(id);
      res.json(actor);
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

    } catch (error) {
      next(error);
    }
  },
  
  getUserFollowers: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

  getUserFollowing: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },
  getUserProfile: async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const user = req.user
    if(user){
       const summary = await ActorService.getActorProfile(user.googleId);
        return res.status(200).json(summary);
    }
    else{
      res.status(401).json({ message: 'User not authenticated' });
    }
       
  }
}; 