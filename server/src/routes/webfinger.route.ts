import { Router } from 'express';
import { WebfingerController } from '../controllers/webfinger.controller';

const router = Router();

router.post('/', WebfingerController.getActorByUsername);

export default router; 