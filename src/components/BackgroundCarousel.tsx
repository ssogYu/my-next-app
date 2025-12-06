"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
  interval?: number;
}

export default function BackgroundCarousel({ images, interval = 6000 }: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 1000);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // 如果没有图片，显示默认渐变背景
  if (images.length === 0) {
    return (
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 from-gray-900 via-gray-800 to-purple-900/20">
        {/* 默认背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-soft-glow" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* 背景图片层 */}
      <div className="absolute inset-0 w-full h-full">
        {/* 主图片 */}
        <Image
          src={images[currentIndex]}
          alt={`Wedding background ${currentIndex + 1}`}
          fill
          className={`object-cover transition-all duration-3000 ease-in-out ${
            isTransitioning ? 'scale-110 opacity-50' : 'scale-105 opacity-100'
          }`}
          style={{
            filter: 'brightness(0.6) contrast(1.1) saturate(1.3)'
          }}
          priority
          sizes="100vw"
          quality={95}
        />

        {/* 多层渐变遮罩增强浪漫氛围 */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-purple-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 backdrop-glow" />

        {/* 径向渐变光晕效果，营造中心聚焦 */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60" />

        {/* 柔和的边缘光晕，增加浪漫感 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300/15 rounded-full blur-3xl animate-soft-glow" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl animate-soft-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/8 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      {/* 环境装饰元素，增强浪漫氛围 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 顶部柔和光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-white/15 to-transparent rounded-b-full blur-2xl animate-soft-glow" />

        {/* 底部柔和光晕 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-t from-white/15 to-transparent rounded-t-full blur-2xl animate-soft-glow" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
}