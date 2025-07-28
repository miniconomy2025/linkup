import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

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

            // TODO userService create user else if exists return user
            const user = { id: googleId, email, name, picture };

            if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

            const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
            res.redirect(`${FRONTEND_URL}/login/success?token=${token}`);
            
        } catch (error) {
            next(error);
        };
    },
};
