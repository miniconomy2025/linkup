import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = Router();

router.get('/me', authenticateJWT, ActorController.getUserProfile);
router.get('/me/followers', authenticateJWT, ActorController.getUserFollowers);
router.get('/me/following', authenticateJWT, ActorController.getUserFollowing);
router.get('/me/posts', authenticateJWT, ActorController.getMyPosts);
router.get('/posts', authenticateJWT, ActorController.getUserPosts);
router.get('/', authenticateJWT, ActorController.getActorProfileById);

router.get('/followers', authenticateJWT, ActorController.getActorFollowers);
router.get('/following', authenticateJWT, ActorController.getActorFollowing);

export default router; 