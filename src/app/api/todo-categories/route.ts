import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';
import { TodoCategoryResponse } from '@/lib/types';

// 默认分类数据
const DEFAULT_CATEGORIES = [
  { name: '场地布置', color: 'rose', icon: '🏰', order: 1 },
  { name: '服装造型', color: 'pink', icon: '👗', order: 2 },
  { name: '摄影摄像', color: 'purple', icon: '📸', order: 3 },
  { name: '宾客邀请', color: 'blue', icon: '👥', order: 4 },
  { name: '餐饮服务', color: 'orange', icon: '🍰', order: 5 },
  { name: '音乐娱乐', color: 'green', icon: '🎵', order: 6 },
  { name: '证件文书', color: 'gray', icon: '📋', order: 7 },
  { name: '其他事项', color: 'indigo', icon: '📦', order: 8 }
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '无效的token' },
        { status: 401 }
      );
    }

    let categories = await db.findTodoCategoriesByUserId(decoded.userId);

    // 如果用户没有分类，创建默认分类
    if (categories.length === 0) {
      for (const categoryData of DEFAULT_CATEGORIES) {
        await db.createTodoCategory({
          userId: decoded.userId,
          ...categoryData
        });
      }
      categories = await db.findTodoCategoriesByUserId(decoded.userId);
    }

    const response: TodoCategoryResponse = {
      success: true,
      data: categories.map(category => ({
        id: category._id.toString(),
        userId: category.userId,
        name: category.name,
        color: category.color,
        icon: category.icon,
        order: category.order,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching todo categories:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: '未登录' },
        { status: 401 }
      );
    }

    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '无效的token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color = 'gray', icon = '📦', order } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: '分类名称不能为空' },
        { status: 400 }
      );
    }

    // 如果没有提供order，设置为最大order + 1
    const existingCategories = await db.findTodoCategoriesByUserId(decoded.userId);
    const finalOrder = order || (existingCategories.length > 0 ? Math.max(...existingCategories.map(c => c.order)) + 1 : 1);

    const categoryData = {
      userId: decoded.userId,
      name: name.trim(),
      color,
      icon,
      order: finalOrder,
    };

    const category = await db.createTodoCategory(categoryData);

    const response: TodoCategoryResponse = {
      success: true,
      message: '分类创建成功',
      data: {
        id: category._id.toString(),
        userId: category.userId,
        name: category.name,
        color: category.color,
        icon: category.icon,
        order: category.order,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating todo category:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}