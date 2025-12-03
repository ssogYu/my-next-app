import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { LoginRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: '请填写邮箱和密码' },
        { status: 400 }
      );
    }

    const result = await AuthService.login(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    const response = NextResponse.json(result, { status: 200 });

    if (result.token) {
      response.cookies.set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}