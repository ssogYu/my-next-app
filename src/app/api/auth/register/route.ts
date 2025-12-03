import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { RegisterRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度至少为6位' },
        { status: 400 }
      );
    }

    const result = await AuthService.register(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}