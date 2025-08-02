import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { ActorService } from '../services/actor.service';
import { createUser } from '../graph/graph.queries.';

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
            await createUser(`${appUrl}/actors/${googleId}`)
            if (!actor) {
                    actor = await ActorService.createActor({
                    id: `${appUrl}/actors/${googleId}`,
                    type: "Person",
                    preferredUsername: googleId,
                    name: name!,
                    inbox: `${appUrl}/actors/${googleId}/inbox`,
                    outbox: `${appUrl}/actors/${googleId}/outbox`,
                    followers: `${appUrl}/actors/${googleId}/followers`,
                    following: `${appUrl}/actors/${googleId}/following`,
                    icon: {
                        type: 'Image',  
                        url: picture,
                        attributedTo: `${appUrl}/actors/${googleId}`,
                        published: new Date().toISOString(),
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
