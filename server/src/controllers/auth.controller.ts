import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { ActorService } from '../services/actor.service';
import { ActorGraphRepository } from '../graph/repositories/actor';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
);

export const AuthController = {
    login: async (req: Request, res: Response, next: NextFunction) => {
        
        if (!req.query.code || typeof req.query.code !== 'string') {
            return res.status(400).send('Invalid or missing code');
        };

        try {
            const { tokens } = await client.getToken(req.query.code);

            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                return res.status(400).send('Invalid token payload');
            };

            const { email, name, sub: googleId, picture = '' } = payload;
            
            let actor = await ActorService.getActorById(googleId);
            const appUrl = process.env.FRONTEND_URL;
            const url = process.env.BASE_URL;

            if (!actor) {
                     await  ActorGraphRepository.createActor(`${url}/actors/${googleId}`)
                    actor = await ActorService.createActor({
                    id: `${url}/actors/${googleId}`,
                    type: "Person",
                    preferredUsername: googleId,
                    name: name!,
                    inbox: `${url}/actors/${googleId}/inbox`,
                    outbox: `${url}/actors/${googleId}/outbox`,
                    followers: `${url}/actors/${googleId}/followers`,
                    following: `${url}/actors/${googleId}/following`,
                    icon: {
                        id: 'test',
                        type: 'Image',  
                        url: picture,
                        attributedTo: `${url}/actors/${googleId}`,
                        to: ['https://www.w3.org/ns/activitystreams#Public'],
                    }});
        }
    
            const user = { ...actor, email, googleId, picture };
            
            if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.redirect(`${appUrl}/login/success?token=${token}`);
            
        } catch (error) {
            next(error);
        };
    },
};
