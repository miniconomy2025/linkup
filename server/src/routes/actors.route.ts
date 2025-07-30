import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
const router = Router();

router.get('/:id', ActorController.getActorById);
router.get('/:id/outbox', ActorController.getUserOutbox);
router.get('/:id/followers', ActorController.getUserFollowers);
router.get('/:id/following', ActorController.getUserFollowing);

router.post('/outbox', ActorController.postActivityToOutbox);
router.post('/:id/inbox', ActorController.postActivityToInbox); // All activities posted here (like, follow, undo)

export default router; 