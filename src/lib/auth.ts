import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResponse, LoginRequest, RegisterRequest } from './types';
import { db } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      return null;
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: '用户已存在',
        };
      }

      const hashedPassword = await this.hashPassword(userData.password);
      const user = await db.createUser({
        ...userData,
        password: hashedPassword,
      });

      const token = this.generateToken(user._id.toString());

      return {
        success: true,
        message: '注册成功',
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        token,
      };
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return {
          success: false,
          message: '用户已存在',
        };
      }
      return {
        success: false,
        message: '注册失败',
      };
    }
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const user = await db.findUserByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          message: '用户不存在',
        };
      }

      const isPasswordValid = await this.comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: '密码错误',
        };
      }

      const token = this.generateToken(user._id.toString());

      return {
        success: true,
        message: '登录成功',
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
        token,
      };
    } catch {
      return {
        success: false,
        message: '登录失败',
      };
    }
  }

  static async getUserById(id: string) {
    const user = await db.findUserById(id);
    if (!user) return null;

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
  }
}