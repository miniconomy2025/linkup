import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../middleware/errorHandler';
import { ActivityObjectService } from '../services/activityObject.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const ObjectController = {
  getNoteById: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

  postNote: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {      
      if (!req.body.content) {
        throw new BadRequestError('Content required to post a note');
      }

      const note = await ActivityObjectService.postNote(req.body.content, req.user.sub);

      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  getImageById: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

  postImage: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const image = await ActivityObjectService.postImage(req.file, req.user.googleId, req.body.caption);

      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  },
  
  getVideoById: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      next(error);
    }
  },

  postVideo: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {      
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const image = await ActivityObjectService.postVideo(req.file, req.user.googleId, req.body.caption);

      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  },
}; 