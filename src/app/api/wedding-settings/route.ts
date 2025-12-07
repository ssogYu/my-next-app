import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';
import { WeddingSettingsResponse } from '@/lib/types';

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

    const settings = await db.findWeddingSettingsByUserId(decoded.userId);

    const response: WeddingSettingsResponse = {
      success: true,
      data: settings ? {
        id: settings._id.toString(),
        brideName: settings.brideName,
        groomName: settings.groomName,
        weddingDate: settings.weddingDate.toISOString(),
        backgroundImages: settings.backgroundImages,
        theme: settings.theme,
        weddingQuote: settings.weddingQuote,
        userId: settings.userId,
        createdAt: settings.createdAt.toISOString(),
        updatedAt: settings.updatedAt.toISOString(),
      } : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching wedding settings:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { brideName, groomName, weddingDate, backgroundImages, theme, weddingQuote } = body;

    if (weddingDate && new Date(weddingDate) <= new Date()) {
      return NextResponse.json(
        { success: false, message: '婚礼日期必须是未来的日期' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (brideName !== undefined) updates.brideName = brideName;
    if (groomName !== undefined) updates.groomName = groomName;
    if (weddingDate !== undefined) updates.weddingDate = new Date(weddingDate);
    if (backgroundImages !== undefined) updates.backgroundImages = backgroundImages;
    if (theme !== undefined) updates.theme = theme;
    if (weddingQuote !== undefined) updates.weddingQuote = weddingQuote;

    const settings = await db.updateWeddingSettings(decoded.userId, updates);

    const response: WeddingSettingsResponse = {
      success: true,
      message: '婚礼设置更新成功',
      data: settings ? {
        id: settings._id.toString(),
        brideName: settings.brideName,
        groomName: settings.groomName,
        weddingDate: settings.weddingDate.toISOString(),
        backgroundImages: settings.backgroundImages,
        theme: settings.theme,
        weddingQuote: settings.weddingQuote,
        userId: settings.userId,
        createdAt: settings.createdAt.toISOString(),
        updatedAt: settings.updatedAt.toISOString(),
      } : null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error updating wedding settings:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const success = await db.deleteWeddingSettings(decoded.userId);

    return NextResponse.json(
      {
        success: true,
        message: success ? '婚礼设置删除成功' : '未找到婚礼设置'
      },
      { status: success ? 200 : 404 }
    );
  } catch (error) {
    console.error('Error deleting wedding settings:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}