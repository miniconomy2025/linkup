import { UserRepository } from '../repositories/user.repository';
import { User } from '../types/user';
import { UserNotFoundError } from '../middleware/errorHandler';

export const UserService = {
  getUserById: async (id: string): Promise<User> => {
    const user = await UserRepository.getUserById(id);
    if (!user) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }
    return user;
  },
}; 