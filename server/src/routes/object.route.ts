import { Router } from 'express';
import { ObjectController } from '../controllers/object.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get('/image/:id', ObjectController.getImageById);
router.get('/video/:id', ObjectController.getVideoById);

router.post('/image', upload.single('file'), ObjectController.postImage);
router.post('/video', upload.single('file'), ObjectController.postVideo);

export default router; 