import { Request, Response, NextFunction } from 'express';
import { 
  ActivitySchema, 
  CreateActivitySchema, 
} from '../types/validationSchemas'
import { ActorService } from '../services/actor.service';
import { BadRequestError } from '../middleware/errorHandler';
import { ActivityService } from '../services/activity.service';
import { Activity } from '../types/activitypub';
export type RequestWithUser = Request & { user?: any };

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

  postActivityToOutbox: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = ActivitySchema.safeParse(req.body);

      if (!parsed.success) {
        throw new BadRequestError(`Invalid activity payload: ${parsed.error.flatten}`)
      }

      let activity = parsed.data as Activity;

      switch (activity.type) {
        case 'Create':
          CreateActivitySchema.parse(activity);
          activity = await ActivityService.handleCreateActivity(activity);
          break;

        // case 'Follow':
        //   FollowActivitySchema.parse(activity);
        //   await ActivityService.handleFollowActivity(activity);
        //   break;

        // case 'Like':
        //   LikeActivitySchema.parse(activity);
        //   await ActivityService.handleLikeActivity(activity);
        //   break;

        // case 'Undo':
        //   UndoActivitySchema.parse(activity);
        //   await ActivityService.handleUndoActivity(activity);
        //   break;

        default:
          throw new BadRequestError('Not an accepted activity type');
      }

      return res.status(201).json(activity);
    } 
    catch (error) {
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
  getUserProfile: async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user
    if(user){
       const summary = await ActorService.getActorProfile(user.sub);
        return res.status(200).json(summary);
    }
    else{
      res.status(401).json({ message: 'User not authenticated' });
    }
       
  }
}; 