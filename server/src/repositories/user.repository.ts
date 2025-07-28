import UserModel from '../models/user.model';
import { User } from '../types/user';

export const UserRepository = {
  getUserById: async (id: string): Promise<User | null> => {
    return UserModel.findById(id).lean<User>().exec();
  },
}; 