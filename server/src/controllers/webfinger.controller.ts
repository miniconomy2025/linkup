import { Request, Response, NextFunction } from 'express';
import { BadRequestError, UserNotFoundError } from '../middleware/errorHandler';
import { ActorService } from '../services/actor.service';

export const WebfingerController = {
  getActorByUsername: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resource = req.query.resource as string;
            if (!resource || !resource.startsWith('acct:')) {
                throw new BadRequestError('Invalid resource');
            }

            const [username, domain] = resource.replace('acct:', '').split('@');

            if (!username || !domain) {
                throw new BadRequestError('Username and domain is required')
            }

            const actor = await ActorService.getActorByUserName(username);
            if (!actor) {
                throw new UserNotFoundError(`User with username ${username} not found`);
            }

            return res
            .type('application/jrd+json')
            .json({
                subject: `acct:${username}@${domain}`,
                aliases: [
                actor.id
                ],
                links: [
                {
                    rel: 'self',
                    type: 'application/activity+json',
                    href: actor.id
                }
                ]
            });

        } catch (error) {
            next(error);
        }
    },
};
