import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = Router();

router.post('/likes', authenticateJWT, ActivityController.createLikeActivity);
router.post('/follows', authenticateJWT, ActivityController.createFollowActorActivity);
router.post('/undos', authenticateJWT, ActivityController.createUndoActivity);

// Activitypub
router.get('/creates/:id', ActivityController.getCreateById);
router.get('/likes/:id', ActivityController.getLikeById);
router.get('/follows/:id', ActivityController.getFollowById);
router.get('/undos/:id', ActivityController.getUndoById);

export default router; 