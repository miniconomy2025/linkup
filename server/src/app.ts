import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { connectMongoDB } from './config/mongoose';
import postRoutes from './routes/posts.route';
import commentRoutes from './routes/comments.route';
import inboxRoutes from './routes/inbox.route';
import outboxRoutes from './routes/outbox.route';
import actorsRoutes from './routes/actors.route';
import authRoutes from './routes/auth.route';

import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

connectMongoDB();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/inbox', inboxRoutes);
app.use('/outbox', outboxRoutes);
app.use('/actors', actorsRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;