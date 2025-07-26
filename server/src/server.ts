import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './graph/graph.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
