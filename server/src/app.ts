import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { connectMongoDB } from './config/mongoose';
import actorsRoutes from './routes/actors.route';
import authRoutes from './routes/auth.route';
import searchRoutes from './routes/search.route';
import objectRoutes from './routes/object.route';
import profileRoutes from './routes/profile.route';

import { errorHandler } from './middleware/errorHandler';
import { authenticateJWT } from './middleware/authMiddleware';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));

connectMongoDB();

app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/object', objectRoutes)
app.use('/api/profile',authenticateJWT,profileRoutes )

app.use(errorHandler);

export default app;