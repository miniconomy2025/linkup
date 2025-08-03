import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = Router();

router.get('/me', authenticateJWT, ActorController.getUserProfile);
router.get('/me/posts', authenticateJWT, ActorController.getUserPosts);

export default router; 