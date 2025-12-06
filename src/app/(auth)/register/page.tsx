'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('密码长度至少为6位');
      setLoading(false);
      return;
    }

    const result = await register(username, email, password);

    if (result.success) {
      router.push('/home');
    } else {
      setError(result.message || '注册失败');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 浪漫渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100" />

      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 左上角装饰 */}
        <div className="absolute top-10 left-10 text-pink-200/30 text-6xl animate-breathe">✿</div>
        <div className="absolute top-20 left-20 text-rose-200/20 text-4xl animate-float" style={{ animationDelay: '1s' }}>❦</div>

        {/* 右上角装饰 */}
        <div className="absolute top-10 right-10 text-rose-200/30 text-6xl animate-breathe" style={{ animationDelay: '2s' }}>✧</div>
        <div className="absolute top-16 right-16 text-purple-200/20 text-3xl animate-float" style={{ animationDelay: '1.5s' }}>✦</div>

        {/* 左下角装饰 */}
        <div className="absolute bottom-10 left-10 text-purple-200/30 text-5xl animate-breathe" style={{ animationDelay: '1s' }}>✿</div>
        <div className="absolute bottom-20 left-20 text-pink-200/20 text-4xl animate-float" style={{ animationDelay: '2.5s' }}>✧</div>

        {/* 右下角装饰 */}
        <div className="absolute bottom-10 right-10 text-rose-200/30 text-6xl animate-breathe" style={{ animationDelay: '3s' }}>❦</div>
        <div className="absolute bottom-16 right-16 text-purple-200/20 text-3xl animate-float" style={{ animationDelay: '0.5s' }}>✿</div>

        {/* 星光点缀 */}
        <div className="absolute top-1/4 left-1/3 text-pink-300/40 text-xl animate-twinkle" />
        <div className="absolute top-1/5 right-1/4 text-rose-300/30 text-lg animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 text-purple-300/40 text-sm animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 text-pink-300/30 text-lg animate-twinkle" style={{ animationDelay: '1.5s' }} />

        {/* 飘落花瓣效果 */}
        <div className="absolute top-0 left-1/5 text-pink-200/20 text-2xl animate-falling-petals" style={{ animationDelay: '0s' }}>✿</div>
        <div className="absolute top-0 right-1/5 text-rose-200/15 text-xl animate-falling-petals" style={{ animationDelay: '3s' }}>❦</div>
        <div className="absolute top-0 left-2/3 text-purple-200/20 text-lg animate-falling-petals" style={{ animationDelay: '6s' }}>✧</div>
      </div>

      {/* 光晕效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-soft-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/10 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* 玻璃拟态卡片 */}
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 animate-fadeInUp">
            {/* 标题区域 */}
            <div className="text-center space-y-4">
              {/* 双爱心装饰 */}
              <div className="flex justify-center items-center space-x-4">
                <div className="relative">
                  <div className="text-4xl md:text-5xl animate-heartbeat-romantic" style={{
                    background: 'linear-gradient(45deg, #e91e63, #ff4081, #ff006e)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 25px rgba(233, 30, 99, 0.6))',
                    animationDelay: '0s'
                  }}>
                    ❤️
                  </div>
                </div>

                {/* 连接符 */}
                <div className="text-rose-400 text-2xl animate-pulse">✦</div>

                <div className="relative">
                  <div className="text-4xl md:text-5xl animate-heartbeat-romantic" style={{
                    background: 'linear-gradient(45deg, #9c27b0, #e91e63, #ff006e)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 25px rgba(233, 30, 99, 0.6))',
                    animationDelay: '0.5s'
                  }}>
                    ❤️
                  </div>
                </div>
              </div>

              {/* 标题 */}
              <h2 className="font-playfair text-3xl md:text-4xl font-light text-rose-800 animate-fade-in-text">
                创建爱的账户
              </h2>

              {/* 副标题 */}
              <p className="text-rose-600 text-sm md:text-base font-montserrat">
                开始记录您的浪漫故事
              </p>

              {/* 装饰线条 */}
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
                <span className="text-rose-400 text-sm animate-pulse">✧</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
              </div>
            </div>

            {/* 注册表单 */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* 用户名输入 */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-rose-700 font-montserrat">
                  您的名字
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-rose-400">👤</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-rose-200/50 rounded-2xl text-rose-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300/50 transition-all duration-300 font-montserrat"
                    placeholder="请输入您的名字"
                  />
                </div>
              </div>

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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-rose-200/50 rounded-2xl text-rose-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300/50 transition-all duration-300 font-montserrat"
                    placeholder="请输入密码（至少6位）"
                  />
                </div>
                <p className="text-xs text-rose-500 ml-2">密码长度至少为6位</p>
              </div>

              {/* 错误信息 */}
              {error && (
                <div className="text-rose-600 text-sm text-center animate-fadeInUp">
                  {error}
                </div>
              )}

              {/* 注册按钮 */}
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
                      注册中...
                    </span>
                  ) : (
                    '创建账户'
                  )}
                </button>
              </div>
            </form>

            {/* 登录链接 */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
                <span className="text-rose-400 text-sm animate-pulse">✧</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
              </div>

              <p className="text-rose-600 text-sm font-montserrat">
                已有账户？{' '}
                <Link
                  href="/login"
                  className="font-medium text-rose-500 hover:text-rose-600 transition-colors duration-200 underline decoration-rose-300 underline-offset-2 hover:decoration-rose-400"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-6 text-rose-400/40 text-sm font-dancing-script">
            每一份爱，都值得被记录
          </div>
        </div>
      </div>
    </div>
  );
}