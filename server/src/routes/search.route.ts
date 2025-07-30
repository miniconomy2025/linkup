import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { SearchController } from '../controllers/search.controller';

const router = Router();

router.get('/', authenticateJWT, SearchController.searchActor);

export default router; 