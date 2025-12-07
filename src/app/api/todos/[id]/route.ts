import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';
import { SingleTodoResponse } from '@/lib/types';

export async function GET(
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

    const todo = await db.findTodoById(id);
    if (!todo || todo.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    const response: SingleTodoResponse = {
      success: true,
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

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

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

    const existingTodo = await db.findTodoById(id);
    if (!existingTodo || existingTodo.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { text, completed, categoryId, priority, parentId, notes, dueDate } = body;

    const updates: any = {};
    if (text !== undefined) updates.text = text.trim();
    if (completed !== undefined) updates.completed = completed;
    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (priority !== undefined) updates.priority = priority;
    if (parentId !== undefined) updates.parentId = parentId;
    if (notes !== undefined) updates.notes = notes.trim();
    if (dueDate !== undefined) {
      if (dueDate && new Date(dueDate) <= new Date()) {
        return NextResponse.json(
          { success: false, message: '截止日期必须是未来的日期' },
          { status: 400 }
        );
      }
      updates.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const todo = await db.updateTodo(id, updates);

    const response: SingleTodoResponse = {
      success: true,
      message: '任务更新成功',
      data: todo ? {
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
      } : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating todo:', error);
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

    const existingTodo = await db.findTodoById(id);
    if (!existingTodo || existingTodo.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      );
    }

    const success = await db.deleteTodo(id);

    return NextResponse.json(
      {
        success: true,
        message: success ? '任务删除成功' : '任务删除失败'
      },
      { status: success ? 200 : 400 }
    );
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}