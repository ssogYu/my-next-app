"use client";

import { useState, useEffect, useRef } from "react";
import BackgroundCarousel from "@/components/BackgroundCarousel";
import Countdown from "@/components/Countdown";
import { useWeddingSettings } from "@/hooks/useWeddingSettings";

// 智能滚动文本组件
const SmartScrollText = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (textRef.current) {
        const scrollWidth = textRef.current.scrollWidth;
        const clientWidth = textRef.current.clientWidth;
        setNeedsScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [text]);

  if (needsScroll) {
    return (
      <div className="relative overflow-hidden">
        <div
          ref={textRef}
          className="romantic-name-display text-base md:text-lg italic leading-relaxed animate-fade-in-text text-xl md:text-2xl whitespace-nowrap"
          style={{
            animation: 'scrollText 15s linear infinite',
            display: 'inline-block',
            padding: '0.5rem 0'
          }}
        >
          <span className="inline-block px-3">{text}</span>
          <span className="inline-block mx-6 text-pink-300">❦</span>
          <span className="inline-block px-3">{text}</span>
          <span className="inline-block mx-6 text-pink-300">❦</span>
          <span className="inline-block px-3">{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={textRef}
      className="romantic-name-display text-base md:text-lg italic leading-relaxed animate-fade-in-text text-xl md:text-2xl text-center"
    >
      {text}
    </div>
  );
};

export default function HomePage() {
  const { settings } = useWeddingSettings();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 背景轮播 */}
      <BackgroundCarousel images={settings.backgroundImages} />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 py-8 md:py-12 lg:py-16">
        {/* 顶部 - 新娘新郎名字 */}
        <div className="text-center space-y-6 animate-fadeInUp">
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light animate-heartbeat-romantic transition-all duration-300 hover:scale-110"
              style={{
                fontFamily: 'var(--font-great-vibes), cursive',
                color: '#ff69b4',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 105, 180, 0.8)',
                animation: 'heartbeatRomantic 2.5s ease-in-out infinite'
              }}
            >
              {settings.groomName}
            </h1>

            {/* 爱心分隔符 - 全新设计 */}
            <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
              {/* 背景光束效果 */}
              <div className="heart-light-beam"></div>

              {/* 多层波纹效果 */}
              <div className="heart-ripple" style={{ animationDelay: '0s' }}></div>
              <div className="heart-ripple" style={{ animationDelay: '0.5s' }}></div>
              <div className="heart-ripple" style={{ animationDelay: '1s' }}></div>

              {/* 3D旋转爱心主体 */}
              <div
                className="relative z-20 text-4xl md:text-5xl"
                style={{
                  background: 'linear-gradient(45deg, #ff006e, #c9184a, #ff4081, #e91e63, #9c27b0, #8e24aa, #ff006e)',
                  backgroundSize: '500% 500%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 40px rgba(233, 30, 99, 1)) drop-shadow(0 0 60px rgba(156, 39, 176, 0.8))',
                  animation: 'heartbeatRomantic 2.5s ease-in-out infinite, colorShift 5s ease-in-out infinite, heart3DRotate 8s ease-in-out infinite',
                  transformStyle: 'preserve-3d'
                }}
              >
                ❤️
              </div>

              {/* 爱心粒子效果 */}
              <div className="heart-particle"></div>
              <div className="heart-particle"></div>
              <div className="heart-particle"></div>
              <div className="heart-particle"></div>

              {/* 爱心碎片效果 */}
              <div className="heart-fragment"></div>
              <div className="heart-fragment"></div>
              <div className="heart-fragment"></div>
              <div className="heart-fragment"></div>

              {/* 内部发光核心 */}
              <div
                className="absolute z-10 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60%',
                  height: '60%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,182,193,0.6) 30%, rgba(233,30,99,0.3) 60%, transparent 100%)',
                  filter: 'blur(2px)',
                  animation: 'softGlow 2s ease-in-out infinite'
                }}
              />
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light animate-heartbeat-romantic transition-all duration-300 hover:scale-110"
              style={{
                fontFamily: 'var(--font-parisienne), cursive',
                color: '#ff69b4',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 105, 180, 0.8)',
                animation: 'heartbeatRomantic 2.5s ease-in-out infinite',
                animationDelay: '0.5s'
              }}
            >
              {settings.brideName}
            </h1>
          </div>

          {/* 装饰性下划线 */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
            <span className="text-rose-200 text-sm animate-pulse">✧</span>
            <div className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
          </div>

          {/* 额外的装饰元素 */}
          <div className="flex items-center justify-center space-x-6 text-rose-200/60 text-xs">
            <span className="animate-float" style={{ animationDelay: '0s' }}>✿</span>
            <span className="font-dancing-script italic">Forever & Always</span>
            <span className="animate-float" style={{ animationDelay: '0.6s' }}>✿</span>
          </div>
        </div>

        {/* 中间 - 倒计时 */}
        <div className="flex-1 flex items-center justify-center">
          <Countdown
            targetDate={settings.weddingDate}
            className="max-w-4xl w-full"
          />
        </div>

        {/* 底部 - 婚礼语录 */}
        <div className="text-center space-y-4 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          {/* 装饰性上划线 */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent via-rose-300/60 to-transparent animate-expand-line" />
            <span className="text-rose-200 text-sm animate-pulse">✧</span>
            <div className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent via-rose-300/60 to-transparent animate-expand-line" />
          </div>

          <blockquote className="max-w-lg mx-auto px-6 md:px-8">
            <SmartScrollText text={settings.weddingQuote} />
          </blockquote>

                  </div>
      </div>

      {/* 漂浮装饰元素 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 左侧装饰 */}
        <div className="absolute top-1/4 left-4 md:left-8 text-white/10 text-4xl md:text-6xl animate-breathe">
          ✿
        </div>
        <div className="absolute top-1/3 left-8 md:left-16 text-white/5 text-3xl md:text-5xl animate-breathe" style={{ animationDelay: '2s' }}>
          ❦
        </div>

        {/* 右侧装饰 */}
        <div className="absolute top-1/4 right-4 md:right-8 text-white/10 text-4xl md:text-6xl animate-breathe" style={{ animationDelay: '1s' }}>
          ✿
        </div>
        <div className="absolute top-1/3 right-8 md:right-16 text-white/5 text-3xl md:text-5xl animate-breathe" style={{ animationDelay: '3s' }}>
          ❦
        </div>

        {/* 星光点缀 */}
        <div className="absolute top-1/6 left-1/4 text-white/20 text-sm animate-twinkle" />
        <div className="absolute top-1/5 right-1/3 text-white/15 text-xs animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 text-white/10 text-xs animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 text-white/20 text-sm animate-twinkle" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 柔和的边缘光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-rose-300/5 rounded-full blur-3xl animate-soft-glow" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/5 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/5 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-300/5 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
}
