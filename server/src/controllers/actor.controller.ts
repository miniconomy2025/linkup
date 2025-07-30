import { Request, Response, NextFunction } from 'express';
import { ActorService } from '../services/actor.service';
import { BadRequestError } from '../middleware/errorHandler';

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
}; 