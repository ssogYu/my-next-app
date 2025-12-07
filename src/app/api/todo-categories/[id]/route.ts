import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';
import { TodoCategoryResponse } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingCategory = await db.findTodoCategoriesByUserId(decoded.userId);
    const category = existingCategory.find(c => c._id.toString() === id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: '分类不存在' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, color, icon, order } = body;

    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (color !== undefined) updates.color = color;
    if (icon !== undefined) updates.icon = icon;
    if (order !== undefined) updates.order = order;

    const updatedCategory = await db.updateTodoCategory(id, updates);

    const response: TodoCategoryResponse = {
      success: true,
      message: '分类更新成功',
      data: updatedCategory ? {
        id: updatedCategory._id.toString(),
        userId: updatedCategory.userId,
        name: updatedCategory.name,
        color: updatedCategory.color,
        icon: updatedCategory.icon,
        order: updatedCategory.order,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString(),
      } : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating todo category:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const existingCategories = await db.findTodoCategoriesByUserId(decoded.userId);
    const category = existingCategories.find(c => c._id.toString() === id);

    if (!category) {
      return NextResponse.json(
        { success: false, message: '分类不存在' },
        { status: 404 }
      );
    }

    // 检查是否有关联的任务
    const todos = await db.findTodosByUserIdAndCategory(decoded.userId, id);
    if (todos.length > 0) {
      return NextResponse.json(
        { success: false, message: '该分类下还有任务，无法删除' },
        { status: 400 }
      );
    }

    const success = await db.deleteTodoCategory(id);

    return NextResponse.json(
      {
        success: true,
        message: success ? '分类删除成功' : '分类删除失败'
      },
      { status: success ? 200 : 400 }
    );
  } catch (error) {
    console.error('Error deleting todo category:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}