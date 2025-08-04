import { Router } from 'express';
import { FeedsController } from '../controllers/feeds.controller';
import { authenticateJWT } from '../middleware/authMiddleware';


const router = Router();

router.get('/', authenticateJWT,FeedsController.getUserFeed);

export default router; 