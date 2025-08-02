import { Router } from 'express';
import { ObjectController } from '../controllers/object.controller';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get('/image/:id', ObjectController.getImageById);
router.get('/video/:id', ObjectController.getVideoById);

router.post('/note', authenticateJWT, ObjectController.postNote);
router.post('/image', authenticateJWT, upload.single('file'), ObjectController.postImage);
router.post('/video', authenticateJWT, upload.single('file'), ObjectController.postVideo);

export default router; 
