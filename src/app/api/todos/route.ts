import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';
import { TodoResponse, SingleTodoResponse, TodoStatsResponse } from '@/lib/types';

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

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const stats = searchParams.get('stats');

    if (stats === 'true') {
      const todoStats = await db.getTodoStats(decoded.userId);

      const response: TodoStatsResponse = {
        success: true,
        data: todoStats,
      };

      return NextResponse.json(response, { status: 200 });
    }

    const todos = categoryId
      ? await db.findTodosByUserIdAndCategory(decoded.userId, categoryId)
      : await db.findTodosByUserId(decoded.userId);

    const response: TodoResponse = {
      success: true,
      data: todos.map(todo => ({
        id: todo._id.toString(),
        userId: todo.userId,
        text: todo.text,
        completed: todo.completed,
        categoryId: todo.categoryId,
        priority: todo.priority,
        parentId: todo.parentId,
        notes: todo.notes,
        dueDate: todo.dueDate?.toISOString(),
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
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
    const { text, categoryId = 'wedding-other', priority = 'medium', parentId, notes, dueDate } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { success: false, message: '任务内容不能为空' },
        { status: 400 }
      );
    }

    if (dueDate && new Date(dueDate) <= new Date()) {
      return NextResponse.json(
        { success: false, message: '截止日期必须是未来的日期' },
        { status: 400 }
      );
    }

    const todoData = {
      userId: decoded.userId,
      text: text.trim(),
      categoryId,
      priority,
      parentId,
      notes: notes?.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    const todo = await db.createTodo(todoData);

    const response: SingleTodoResponse = {
      success: true,
      message: '任务创建成功',
      data: {
        id: todo._id.toString(),
        userId: todo.userId,
        text: todo.text,
        completed: todo.completed,
        categoryId: todo.categoryId,
        priority: todo.priority,
        parentId: todo.parentId,
        notes: todo.notes,
        dueDate: todo.dueDate?.toISOString(),
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}