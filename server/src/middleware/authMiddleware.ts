import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: any;
};

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        };
    } else {
        res.status(401).json({ message: 'Missing token' });
    };
};
