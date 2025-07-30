import { Router } from 'express';
import { ObjectController } from '../controllers/object.controller';
const router = Router();

router.get('/image/:id', ObjectController.getImageById);
router.get('/video/:id', ObjectController.getVideoById);

router.post('/image', ObjectController.postImage);
router.post('/video', ObjectController.postVideo);

export default router; 