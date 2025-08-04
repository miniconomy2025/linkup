import { Response, NextFunction } from "express";
import { ActorService } from "../services/actor.service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { NotAuthenticatedError } from "../middleware/errorHandler";
const apiUrl = process.env.BASE_URL;

export const FeedsController = {
  getUserFeed: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      if (!req.user) {
        throw new NotAuthenticatedError("User not authenticated");
      } else {
         const page = parseInt(req.query.page as string)
         const pageSize = parseInt(req.query.limit as string)
        const actorId = `${apiUrl}/actors/${req.user.googleId}`
        const summary = await ActorService.getFeeds(actorId,page,pageSize);
        return res.status(200).json(summary);
      }
    } catch (error) {
      next(error);
    }
  },
};
