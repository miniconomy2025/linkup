import { Response, NextFunction } from "express";
import { ActorService } from "../services/actor.service";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { NotAuthenticatedError } from "../middleware/errorHandler";
import { mapToActivityObject } from "../utils/mapping";
import { ActorGraphRepository } from "../graph/repositories/actor";
const apiUrl = process.env.BASE_URL;

export const FeedsController = {
  getUserFeed2: async (
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
  getUserFeed: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req?.user?.id) {
        throw new NotAuthenticatedError("User not valid");
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const actorId = req?.user?.id;

      // const user = "https://linkup.tevlen.co.za/api/actors/chrismchardy17545778"

      const followingRes = await fetch(`${actorId}/following`, {
        headers: { Accept: "application/activity+json" },
      });

      const data = await followingRes.json();

      if (!data?.orderedItems || data?.orderedItems.length === 0) {
        throw new NotAuthenticatedError("No followings found");
      }

      const allPosts: any[] = [];

      for (const actor of data.orderedItems) {
        try {
          const actorOutbox = await fetch(`${actor.id}/outbox`, {
            headers: { Accept: "application/activity+json" },
          });

          const outboxData = await actorOutbox.json();

          if (outboxData?.orderedItems) {
            const mappedPosts = outboxData.orderedItems.map((activity: any) =>
              mapToActivityObject(activity.object)
            );

            allPosts.push(...mappedPosts);
          }
        } catch (err) {
          console.error(`Failed to fetch outbox for ${actor.id}`, err);
        }
      }

      // Filter and sort posts by `published` date
      const sortedPosts = allPosts
        .filter((p) => p?.published)
        .sort(
          (a, b) =>
            new Date(b.published).getTime() - new Date(a.published).getTime()
        );

      // Pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedPosts = sortedPosts.slice(start, end);

      // Add `liked` field for each post
      const postsWithLiked = await Promise.all(
        paginatedPosts.map(async (post) => {
          const objectId = post.id;
          const liked = await ActorGraphRepository.hasUserLikedPost(
            objectId,
            actorId
          );
          return {
            ...post,
            liked,
          };
        })
      );

      console.log(postsWithLiked.length)

      res.status(200).json(postsWithLiked);
    } catch (error) {
      next(error);
    }
  },
};
