import express from 'express';
import { connectMongoDB } from './config/mongoose';
import userRoutes from './routes/users.route';
import postRoutes from './routes/posts.route';
import commentRoutes from './routes/comments.route';
import inboxRoutes from './routes/inbox.route';
import outboxRoutes from './routes/outbox.route';



const app = express();
app.use(express.json());

connectMongoDB();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/inbox', inboxRoutes);
app.use('/outbox', outboxRoutes);

export default app;