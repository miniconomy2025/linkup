import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { BadRequestError } from '../middleware/errorHandler';
import { ActivityService } from '../services/activity.service';

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
}; 