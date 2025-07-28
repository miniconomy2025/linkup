import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
const router = Router();

router.get('/:id', UserController.getUserById);

export default router; 