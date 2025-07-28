import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { BadRequestError } from '../middleware/errorHandler';

export const UserController = {
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('User ID is required');
      }
      
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
}; 