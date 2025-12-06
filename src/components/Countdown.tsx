"use client";

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  targetDate: string;
  className?: string;
}

export default function Countdown({ targetDate, className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isClient]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center justify-center group">
      <div className="relative transform transition-all duration-300 group-hover:scale-105">
        {/* 多层背景光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-500/15 to-purple-400/10 rounded-3xl blur-2xl animate-soft-glow" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/15 via-pink-500/10 to-rose-400/5 rounded-3xl blur-xl animate-soft-glow" style={{ animationDelay: '1s' }} />

        {/* 主数字卡片 */}
        <div
          className="relative glass-panel rounded-3xl p-4 md:p-6 min-w-[70px] md:min-w-[90px] h-[70px] md:h-[90px] flex items-center justify-center border border-white/30 shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,182,193,0.1) 50%, rgba(219,234,254,0.05) 100%)',
          }}
        >
          {/* 内部渐变背景 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'shimmerName 3s ease-in-out infinite'
            }}
          />

          {/* 数字显示 */}
          <span
            className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums transition-all duration-300"
            style={{
              background: 'linear-gradient(45deg, #ffffff 0%, #ff6b9d 20%, #e91e63 40%, #ffffff 60%, #ff6b9d 80%, #ffffff 100%)',
              backgroundSize: '300% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(233, 30, 99, 0.8)) drop-shadow(0 0 15px rgba(156, 39, 176, 0.6))',
              animation: 'shimmerName 5s ease-in-out infinite',
              fontFamily: 'var(--font-playfair), serif'
            }}
          >
            {String(value).padStart(2, '0')}
          </span>

          {/* 装饰光点 */}
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-rose-300/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* 装饰花瓣 */}
        <div className="absolute -top-2 -right-2 text-rose-300/70 text-xs animate-float" style={{ animationDelay: '0s' }}>✿</div>
        <div className="absolute -bottom-2 -left-2 text-purple-300/70 text-xs animate-float" style={{ animationDelay: '1s' }}>✦</div>
      </div>

      {/* 标签样式 */}
      <span
        className="text-sm md:text-base text-white/90 font-medium mt-3 tracking-widest uppercase transition-all duration-300 group-hover:text-white"
        style={{
          fontFamily: 'var(--font-dancing-script), cursive',
          textShadow: '0 2px 10px rgba(255, 182, 193, 0.5)'
        }}
      >
        {label}
      </span>
    </div>
  );

  if (!isClient) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-4 gap-2 md:gap-4 lg:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/10 rounded-2xl" />
              <div className="w-8 h-4 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isWeddingDay = timeLeft.days === 0 && timeLeft.hours === 0 &&
                     timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 倒计时标题 */}
      <div className="text-center space-y-4 animate-fadeInUp">
        <h2
          className="text-xl md:text-2xl lg:text-3xl font-light tracking-wider transition-all duration-300 animate-fade-in-text romantic-name-display"
        >
          距离我们婚礼还有
        </h2>

        {/* 装饰分隔线 */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-rose-300/60 to-transparent max-w-[80px] animate-expand-line" />
          <div className="flex space-x-2">
            <span className="text-rose-300 text-sm animate-pulse">✦</span>
            <span className="text-purple-300 text-sm animate-pulse" style={{ animationDelay: '0.3s' }}>❦</span>
            <span className="text-rose-300 text-sm animate-pulse" style={{ animationDelay: '0.6s' }}>✦</span>
          </div>
          <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent via-rose-300/60 to-transparent max-w-[80px] animate-expand-line" />
        </div>

      </div>

      {/* 婚礼当天状态 */}
      {isWeddingDay ? (
        <div className="text-center py-12 animate-fadeInUp">
          <div className="relative inline-block">
            {/* 背景光晕 */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(233,30,99,0.4) 0%, rgba(156,39,176,0.2) 50%, transparent 70%)',
                transform: 'scale(1.2)'
              }}
            />

            <div className="relative glass-panel rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl">
              <h1
                className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-heartbeat-romantic"
                style={{
                  fontFamily: 'var(--font-great-vibes), cursive',
                  background: 'linear-gradient(45deg, #ff006e 0%, #e91e63 25%, #9c27b0 50%, #ff006e 100%)',
                  backgroundSize: '300% 300%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(233, 30, 99, 0.8))',
                  animation: 'heartbeatRomantic 2.5s ease-in-out infinite, colorShift 4s ease-in-out infinite'
                }}
              >
                今天是我们的大日子
              </h1>

              <div
                className="text-xl md:text-2xl text-white/90"
                style={{
                  fontFamily: 'var(--font-dancing-script), cursive',
                  textShadow: '0 2px 15px rgba(255, 182, 193, 0.6)'
                }}
              >
                感谢您见证我们的幸福时刻
              </div>

              {/* 装饰元素 */}
              <div className="flex items-center justify-center space-x-6 mt-6 text-rose-200/60">
                <span className="text-2xl animate-float" style={{ animationDelay: '0s' }}>✿</span>
                <span className="text-sm italic" style={{ fontFamily: 'var(--font-parisienne), cursive' }}>Forever Begins Today</span>
                <span className="text-2xl animate-float" style={{ animationDelay: '0.6s' }}>✿</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 倒计时数字 */
        <div className="relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-96 h-96 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(255,182,193,0.3) 0%, rgba(156,39,176,0.1) 50%, transparent 70%)',
                filter: 'blur(40px)',
                animation: 'softGlow 4s ease-in-out infinite'
              }}
            />
          </div>

          <div className="relative grid grid-cols-4 gap-4 md:gap-8 lg:gap-12 animate-fadeInUp">
            <TimeUnit value={timeLeft.days} label="天" />
            <TimeUnit value={timeLeft.hours} label="时" />
            <TimeUnit value={timeLeft.minutes} label="分" />
            <TimeUnit value={timeLeft.seconds} label="秒" />
          </div>
        </div>
      )}
    </div>
  );
}