import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { connectMongoDB } from './config/mongoose';
import userRoutes from './routes/users.route';
import postRoutes from './routes/posts.route';
import commentRoutes from './routes/comments.route';
import inboxRoutes from './routes/inbox.route';
import outboxRoutes from './routes/outbox.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

connectMongoDB();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/inbox', inboxRoutes);
app.use('/outbox', outboxRoutes);
app.use(errorHandler);

export default app;