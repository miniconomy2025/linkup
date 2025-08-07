import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ObjectNotFoundError, NotAuthenticatedError } from '../middleware/errorHandler';
import { ActivityObjectService } from '../services/activityObject.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const apiUrl = process.env.BASE_URL;
import { ActorGraphRepository } from '../graph/repositories/actor';

export const ObjectController = {
  getNoteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        throw new BadRequestError('Object ID is required')
      }
      
      const postId = `${apiUrl}/objects/notes/${id}`;
      const note = await ActivityObjectService.getPostById(postId);
      if (!note) {
        throw new ObjectNotFoundError();
      }

      res.status(200).json(note);
    } catch (error) {
      next(error);
    }
  },

  postNote: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {      
      if (!req.body.content) {
        throw new BadRequestError('Content required to post a note');
      }

      const note = await ActivityObjectService.postNote(req.body.content, req.user.userName);

      res.status(201).json(note);
    } catch (error) {
      next(error);
    }
  },

  getImageById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        throw new BadRequestError('Object ID is required')
      }
      
      const postId = `${apiUrl}/objects/images/${id}`;
      const image = await ActivityObjectService.getPostById(postId);
      if (!image) {
        throw new ObjectNotFoundError();
      }

      res.status(200).json(image);
    } catch (error) {
      next(error);
    }
  },

  postImage: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const image = await ActivityObjectService.postImage(req.file, req.user.userName, req.body.caption);

      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  },
  
  getVideoById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        throw new BadRequestError('Object ID is required')
      }
      
      const postId = `${apiUrl}/objects/videos/${id}`;
      const vidoes = await ActivityObjectService.getPostById(postId);
      if (!vidoes) {
        throw new ObjectNotFoundError();
      }

      res.status(200).json(vidoes);
    } catch (error) {
      next(error);
    }
  },

  postVideo: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {      
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const video = await ActivityObjectService.postVideo(req.file, req.user.userName, req.body.caption);

      res.status(201).json(video);
    } catch (error) {
      next(error);
    }
  },
    getPostById: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {      
      const postId = req.query.postId as string
      const user = req.user;
      if(!user){
         throw new NotAuthenticatedError("Not authenticated")
      }
      else if(!postId){
        throw new BadRequestError("Post id required")
      }
      else{
        const post = await ActivityObjectService.getPostById(postId)
        const liked = await ActorGraphRepository.hasUserLikedPost(postId,`${process.env.BASE_URL}/actors/${user.userName}`)

      res.status(201).json({...post,liked});

      }
      
    } catch (error) {
      next(error);
    }
  },
}; 