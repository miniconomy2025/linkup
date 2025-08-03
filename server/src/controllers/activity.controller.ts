import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { BadRequestError, NotAuthenticatedError } from '../middleware/errorHandler';
import { ActivityService } from '../services/activity.service';
const apiUrl = process.env.BASE_URL

export const ActivityController = {
    createLikeActivity: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const postId = req.body.postId;
            if (!postId){
                throw new BadRequestError('PostId is required to like');
            }

            const activity = await ActivityService.likePost(postId, req.user.googleId);

            res.status(201).json(activity);
        } catch (error) {
        next(error);
        }
    },

    createFollowActorActivity: async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
      try {
        const followedActorId = req.body.actorId as string;
        if (!followedActorId) {
          throw new BadRequestError("Followed actor id is required");
        } else if (!req.user || !req.user.googleId) {
          throw new NotAuthenticatedError("User not authenticated");
        } else {
          const followerId = `${apiUrl}/actors/${req.user.googleId}`;
          const activity = await ActivityService.followActor(followerId,followedActorId);
          res.status(201).json(activity);
        }
      } catch (error) {
        next(error);
      }
    },

    createUndoActivity: async (req: AuthenticatedRequest,res: Response,next: NextFunction) => {
      try {
        const followedActorId = req.body.actorId as string;
        if (!followedActorId) {
          throw new BadRequestError("Followed actor id is required");
        }

        const followerId = `${apiUrl}/actors/${req.user.googleId}`;

        const activity = await ActivityService.unfollowActor(followerId,followedActorId);

        res.status(200).json(activity);
      } catch (error) {
        next(error);
      }
    }
}; 