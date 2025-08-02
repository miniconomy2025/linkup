import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = Router();

router.post('/likes', authenticateJWT, ActivityController.createLikeActivity);


export default router; 