import { Router } from 'express';
import { ObjectController } from '../controllers/object.controller';
import multer from 'multer';
import { authenticateJWT } from '../middleware/authMiddleware';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/notes', authenticateJWT, ObjectController.postNote);
router.post('/images', authenticateJWT, upload.single('file'), ObjectController.postImage);
router.post('/videos', authenticateJWT, upload.single('file'), ObjectController.postVideo);
router.get('/posts', authenticateJWT, ObjectController.getPostById);

// Activitypub
router.get('/notes/:id', ObjectController.getNoteById);
router.get('/images/:id', ObjectController.getImageById);
router.get('/videos/:id', ObjectController.getVideoById);

export default router; 
