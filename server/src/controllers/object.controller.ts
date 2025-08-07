import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ObjectNotFoundError, NotAuthenticatedError } from '../middleware/errorHandler';
import { ActivityObjectService } from '../services/activityObject.service';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const apiUrl = process.env.BASE_URL;
import { ActorGraphRepository } from '../graph/repositories/actor';
import { ImageObject, NoteObject, VideoObject } from '../types/activitypub';

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

  getMediaType: (url: string) => {
    // Extract everything after the last dot in the URL
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
    return match ? match[1] : null;
  },

  getImageById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      
      if (!id) {
        throw new BadRequestError('Object ID is required')
      }
      
      const postId = `${apiUrl}/objects/images/${id}`;
      const image = await ActivityObjectService.getPostById(postId) as ImageObject;
      if (!image) {
        throw new ObjectNotFoundError();
      }

      const imageType = ObjectController.getMediaType(image.url);

      const noteType = {
        attributedTo: image.attributedTo,
        content: image.name!,
        type: "Note",
        id: image.id,
        published: image.published,
        to: image.to,
        attachment: {
          type: "Image",
          mediaType: `image/${imageType}`,
          url: image.url
        }
      }

      res.status(200).json(noteType);
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
      const vidoes = await ActivityObjectService.getPostById(postId) as VideoObject;
      if (!vidoes) {
        throw new ObjectNotFoundError();
      }

      const videoType = ObjectController.getMediaType(vidoes.url);

      const noteType = {
        attributedTo: vidoes.attributedTo,
        content: vidoes.name!,
        type: "Note",
        id: vidoes.id,
        published: vidoes.published,
        to: vidoes.to,
        attachment: {
          type: "Video",
          mediaType: `video/${videoType}`,
          url: vidoes.url
        }
      }

      res.status(200).json(noteType);
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