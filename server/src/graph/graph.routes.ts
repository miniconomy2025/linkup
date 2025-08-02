import { Router, Request, Response } from 'express';
import { createUser,getAllUsers } from './graph.queries.';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { id, username } = req.body;

  if (!id || !username) {
    return res.status(400).json({ error: 'id and username are required' });
  }

  try {
    await createUser(id);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
