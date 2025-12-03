import connectDB from './mongodb';
import User, { IUser } from '../models/User';

export class MongoDBService {
  static async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findOne({ email }).lean();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findUserById(id: string): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findById(id).lean();
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<IUser> {
    try {
      await connectDB();
      const user = new User(userData);
      return await user.save();
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 11000) {
        throw new Error('User with this email already exists');
      }
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    try {
      await connectDB();
      return await User.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await User.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async getAllUsers(): Promise<IUser[]> {
    try {
      await connectDB();
      return await User.find({}).select('-password').lean();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

export const db = MongoDBService;