import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
const router = Router();

router.get('/me', ActorController.getUserProfile);

export default router; 