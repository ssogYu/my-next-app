'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.push('/home');
    } else {
      setError(result.message || '登录失败');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 浪漫渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100" />

      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 左上角装饰 */}
        <div className="absolute top-10 left-10 text-rose-200/30 text-6xl animate-breathe">❦</div>
        <div className="absolute top-20 left-20 text-pink-200/20 text-4xl animate-float" style={{ animationDelay: '1s' }}>✿</div>

        {/* 右上角装饰 */}
        <div className="absolute top-10 right-10 text-purple-200/30 text-6xl animate-breathe" style={{ animationDelay: '2s' }}>✦</div>
        <div className="absolute top-16 right-16 text-rose-200/20 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>✿</div>

        {/* 左下角装饰 */}
        <div className="absolute bottom-10 left-10 text-pink-200/30 text-5xl animate-breathe" style={{ animationDelay: '1s' }}>✧</div>
        <div className="absolute bottom-20 left-20 text-purple-200/20 text-4xl animate-float" style={{ animationDelay: '2.5s' }}>❦</div>

        {/* 右下角装饰 */}
        <div className="absolute bottom-10 right-10 text-rose-200/30 text-6xl animate-breathe" style={{ animationDelay: '3s' }}>✿</div>
        <div className="absolute bottom-16 right-16 text-pink-200/20 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>✦</div>

        {/* 星光点缀 */}
        <div className="absolute top-1/4 left-1/4 text-rose-300/40 text-xl animate-twinkle" />
        <div className="absolute top-1/5 right-1/3 text-pink-300/30 text-lg animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 text-purple-300/40 text-sm animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/4 text-rose-300/30 text-lg animate-twinkle" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 光晕效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-soft-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/10 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* 玻璃拟态卡片 */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 animate-fadeInUp">
            {/* 标题区域 */}
            <div className="text-center space-y-4">
              {/* 爱心装饰 */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="text-5xl md:text-6xl animate-heartbeat-romantic" style={{
                    background: 'linear-gradient(45deg, #ff006e, #e91e63, #9c27b0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 30px rgba(233, 30, 99, 0.6))'
                  }}>
                    ❤️
                  </div>
                  <div className="absolute inset-0 text-5xl md:text-6xl animate-pulse-ring" style={{
                    background: 'linear-gradient(45deg, #ff006e, #e91e63, #9c27b0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ❤️
                  </div>
                </div>
              </div>

              {/* 标题 */}
              <h2 className="font-playfair text-3xl md:text-4xl font-light text-rose-800 animate-fade-in-text">
                欢迎回来
              </h2>

              {/* 副标题 */}
              <p className="text-rose-600 text-sm md:text-base font-montserrat">
                开启您的浪漫婚礼之旅
              </p>

              {/* 装饰线条 */}
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
                <span className="text-rose-400 text-sm animate-pulse">✧</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
              </div>
            </div>

            {/* 登录表单 */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* 邮箱输入 */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-rose-700 font-montserrat">
                  邮箱地址
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-rose-400">✉</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-rose-200/50 rounded-2xl text-rose-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300/50 transition-all duration-300 font-montserrat"
                    placeholder="请输入您的邮箱"
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-rose-700 font-montserrat">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-rose-400">🔒</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-rose-200/50 rounded-2xl text-rose-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300/50 transition-all duration-300 font-montserrat"
                    placeholder="请输入您的密码"
                  />
                </div>
              </div>

              {/* 错误信息 */}
              {error && (
                <div className="text-rose-600 text-sm text-center animate-fadeInUp">
                  {error}
                </div>
              )}

              {/* 登录按钮 */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white font-montserrat font-medium rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      登录中...
                    </span>
                  ) : (
                    '登录'
                  )}
                </button>
              </div>
            </form>

            {/* 注册链接 */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
                <span className="text-rose-400 text-sm animate-pulse">✧</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
              </div>

              <p className="text-rose-600 text-sm font-montserrat">
                还没有账户？{' '}
                <Link
                  href="/register"
                  className="font-medium text-rose-500 hover:text-rose-600 transition-colors duration-200 underline decoration-rose-300 underline-offset-2 hover:decoration-rose-400"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-6 text-rose-400/40 text-sm font-dancing-script">
            有爱，每一天都是情人节
          </div>
        </div>
      </div>
    </div>
  );
}