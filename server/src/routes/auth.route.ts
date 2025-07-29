import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/google/callback', AuthController.login);
router.get('/test', authenticateJWT, (_, res) => {
    return res.status(200).json('Authenticated');
});

export default router; 