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
import healthRoute from './routes/health.route';
import feedsRouter from './routes/feeds.route'
import webfingerRoute from './routes/webfinger.route';

import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: 'http://localhost:5173' }));

connectMongoDB();

app.use('/', webfingerRoute);
app.use('/auth', authRoutes);
app.use('/', healthRoute);
app.use('/search', searchRoutes);
app.use('/objects', objectRoutes);
app.use('/profiles', profileRoutes);
app.use('/activities', activityRoutes);
app.use('/feeds', feedsRouter);

app.use(errorHandler);

export default app;