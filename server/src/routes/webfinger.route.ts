import { Router } from 'express';
import { WebfingerController } from '../controllers/webfinger.controller';

const router = Router();

router.get('/.well-known/webfinger', WebfingerController.getActorByUsername);

export default router; 