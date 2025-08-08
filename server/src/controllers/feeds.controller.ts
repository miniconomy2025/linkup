import { Response, NextFunction } from "express";
import { ActorService } from "../services/actor.service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { NotAuthenticatedError } from "../middleware/errorHandler";
import { mapToActivityObject } from "../utils/mapping";
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
        const actorId = `${apiUrl}/actors/${req.user.userName}`
        const summary = await ActorService.getFeeds(actorId,page,pageSize);
        res.status(200).json(summary);
      }
    } catch (error) {
      next(error);
    }
  },
  getUserFeedTest: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req?.user?.id) {
        throw new NotAuthenticatedError("User not valid");
      };
      const user = "https://linkup.tevlen.co.za/api/actors/chrismchardy17545778"
    
      // Fetch all following actors
      const following = await fetch(`${user}/following`, {
          headers: {
              Accept: "application/activity+json",
          },
      });

      const data = await following.json();

      if (!data?.orderedItems && data?.orderedItems.length <= 0) {
        throw new NotAuthenticatedError("Not followings found");
      };

      const posts: string | any[] = [];


      for (const actor of data?.orderedItems) {
        try {
          const actorOutbox = await fetch(`${actor.id}/outbox`, {
            headers: {
              Accept: "application/activity+json",
            },
          });

          const outboxData = await actorOutbox.json();
// console.log(outboxData)
          if (outboxData?.orderedItems) {
            const values = outboxData.orderedItems.map((activity: any) => mapToActivityObject(activity.object));
           
            posts.push(...values);
          };

        } catch (err) {
          console.error(`Failed to fetch outbox for ${actor}`, err);
        }
      };
 console.log(posts)
      return res.status(200).json(posts);

    } catch (error) {
        next(error);
    }
  },
};
