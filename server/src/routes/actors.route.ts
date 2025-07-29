import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
const router = Router();

router.get('/:id', ActorController.getActorById);

export default router; 