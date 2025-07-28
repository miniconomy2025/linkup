import UserModel from '../models/user.model';
import { User } from '../types/user';

export const UserRepository = {
  getUserById: async (preferredUsername: string): Promise<User | null> => {
    return UserModel.findOne({ preferredUsername }).lean<User>().exec();
  },
}; 