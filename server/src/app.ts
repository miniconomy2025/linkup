import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { connectMongoDB } from './config/mongoose';
import authRoutes from './routes/auth.route';
import searchRoutes from './routes/search.route';
import objectRoutes from './routes/object.route';
import profileRoutes from './routes/profile.route';
import activityRoutes from './routes/activity.route';

import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));

connectMongoDB();

app.use('/auth', authRoutes);

app.use('/api/search', searchRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/activities', activityRoutes);

app.use(errorHandler);

export default app;