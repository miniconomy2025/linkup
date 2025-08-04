import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { authenticateJWT } from '../middleware/authMiddleware';
const router = Router();

router.post('/likes', authenticateJWT, ActivityController.createLikeActivity);
router.post('/follows', authenticateJWT, ActivityController.createFollowActorActivity);
router.post('/undos', authenticateJWT, ActivityController.createUndoActivity);


export default router; 