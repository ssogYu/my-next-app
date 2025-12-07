import connectDB from './mongodb';
import User, { IUser } from '../models/User';
import WeddingSettings, { IWeddingSettings } from '../models/WeddingSettings';
import { Todo, TodoCategory, ITodo, ITodoCategory } from '../models/Todo';

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

  // Wedding Settings methods
  static async findWeddingSettingsByUserId(userId: string): Promise<IWeddingSettings | null> {
    try {
      await connectDB();
      return await WeddingSettings.findOne({ userId }).lean();
    } catch (error) {
      console.error('Error finding wedding settings by user ID:', error);
      throw error;
    }
  }

  static async createWeddingSettings(settingsData: {
    userId: string;
    brideName: string;
    groomName: string;
    weddingDate: Date;
    backgroundImages?: string[];
    theme?: 'light' | 'dark';
    weddingQuote?: string;
  }): Promise<IWeddingSettings> {
    try {
      await connectDB();
      const settings = new WeddingSettings(settingsData);
      return await settings.save();
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      if (err.code === 11000) {
        throw new Error('Wedding settings for this user already exist');
      }
      console.error('Error creating wedding settings:', error);
      throw error;
    }
  }

  static async updateWeddingSettings(userId: string, updates: Partial<IWeddingSettings>): Promise<IWeddingSettings | null> {
    try {
      await connectDB();
      return await WeddingSettings.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true, upsert: true }
      ).lean();
    } catch (error) {
      console.error('Error updating wedding settings:', error);
      throw error;
    }
  }

  static async deleteWeddingSettings(userId: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await WeddingSettings.findOneAndDelete({ userId });
      return result !== null;
    } catch (error) {
      console.error('Error deleting wedding settings:', error);
      throw error;
    }
  }

  // Todo Category methods
  static async findTodoCategoryById(id: string): Promise<ITodoCategory | null> {
    try {
      await connectDB();
      return await TodoCategory.findById(id).lean();
    } catch (error) {
      console.error('Error finding todo category by ID:', error);
      throw error;
    }
  }

  static async findTodoCategoriesByUserId(userId: string): Promise<ITodoCategory[]> {
    try {
      await connectDB();
      return await TodoCategory.find({ userId }).sort({ order: 1 }).lean();
    } catch (error) {
      console.error('Error finding todo categories by user ID:', error);
      throw error;
    }
  }

  static async createTodoCategory(categoryData: {
    userId: string;
    name: string;
    color?: string;
    icon?: string;
    order?: number;
  }): Promise<ITodoCategory> {
    try {
      await connectDB();
      const category = new TodoCategory(categoryData);
      return await category.save();
    } catch (error) {
      console.error('Error creating todo category:', error);
      throw error;
    }
  }

  static async updateTodoCategory(id: string, updates: Partial<ITodoCategory>): Promise<ITodoCategory | null> {
    try {
      await connectDB();
      return await TodoCategory.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      console.error('Error updating todo category:', error);
      throw error;
    }
  }

  static async deleteTodoCategory(id: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await TodoCategory.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting todo category:', error);
      throw error;
    }
  }

  // Todo methods
  static async findTodosByUserId(userId: string): Promise<ITodo[]> {
    try {
      await connectDB();
      return await Todo.find({ userId }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error finding todos by user ID:', error);
      throw error;
    }
  }

  static async findTodosByUserIdAndCategory(userId: string, categoryId: string): Promise<ITodo[]> {
    try {
      await connectDB();
      return await Todo.find({ userId, categoryId }).sort({ createdAt: -1 }).lean();
    } catch (error) {
      console.error('Error finding todos by user ID and category:', error);
      throw error;
    }
  }

  static async findTodoById(id: string): Promise<ITodo | null> {
    try {
      await connectDB();
      return await Todo.findById(id).lean();
    } catch (error) {
      console.error('Error finding todo by ID:', error);
      throw error;
    }
  }

  static async createTodo(todoData: {
    userId: string;
    text: string;
    categoryId?: string;
    priority?: 'high' | 'medium' | 'low';
    parentId?: string;
    notes?: string;
    dueDate?: Date;
  }): Promise<ITodo> {
    try {
      await connectDB();
      const todo = new Todo(todoData);
      return await todo.save();
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  static async updateTodo(id: string, updates: Partial<ITodo>): Promise<ITodo | null> {
    try {
      await connectDB();
      return await Todo.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  static async deleteTodo(id: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await Todo.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  static async deleteTodosByUserId(userId: string): Promise<boolean> {
    try {
      await connectDB();
      const result = await Todo.deleteMany({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting todos by user ID:', error);
      throw error;
    }
  }

  static async getTodoStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    byCategory: Record<string, { total: number; completed: number; pending: number }>;
  }> {
    try {
      await connectDB();
      const todos = await Todo.find({ userId }).lean();

      const stats = {
        total: todos.length,
        completed: todos.filter(todo => todo.completed).length,
        pending: todos.filter(todo => !todo.completed).length,
        byCategory: {} as Record<string, { total: number; completed: number; pending: number }>,
      };

      // Group by category
      todos.forEach(todo => {
        if (!stats.byCategory[todo.categoryId]) {
          stats.byCategory[todo.categoryId] = { total: 0, completed: 0, pending: 0 };
        }
        stats.byCategory[todo.categoryId].total++;
        if (todo.completed) {
          stats.byCategory[todo.categoryId].completed++;
        } else {
          stats.byCategory[todo.categoryId].pending++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting todo stats:', error);
      throw error;
    }
  }
}

export const db = MongoDBService;