// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 受保护路由
const protectedRoutes = ['/task', '/setting', '/home']

// 公开路由（已登录不能访问）
const authRoutes = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value


  // 检查是否是受保护路由
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // 检查是否是认证路由
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // 未登录访问受保护路由 → 跳转登录页
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 已登录访问认证页面 → 跳转控制台
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // 传递当前路径给布局
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}