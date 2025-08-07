import { Router } from 'express';
import { ActorController } from '../controllers/actor.controller';
const router = Router();

router.get('/:id', ActorController.getActorByUsername);
router.get('/:id/outbox', ActorController.getUserOutbox);
router.get('/:id/followers', ActorController.getFollowersActivityPub);
router.get('/:id/following', ActorController.getFollowingActivityPub);

router.post('/:id/inbox', ActorController.postActivityToInbox); // All activities posted here (like, follow, undo)

export default router; 