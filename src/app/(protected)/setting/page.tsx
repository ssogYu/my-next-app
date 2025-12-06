"use client";

import { useState } from 'react';
import { useWeddingSettings, WeddingSettings } from "@/hooks/useWeddingSettings";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "@/components/ImageUpload";

export default function SettingPage() {
  const { settings, updateSettings, resetSettings } = useWeddingSettings();
  const { logout } = useAuth();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const handleSettingChange = (key: keyof WeddingSettings, value: any) => {
    updateSettings({ [key]: value });
  };

  const handleLogout = () => {
    logout();
    setIsConfirmingLogout(false);
  };

  
  
  const handleImageUpload = (imageUrl: string) => {
    // 将新上传的图片添加到现有背景图片中
    const updatedImages = [...settings.backgroundImages, imageUrl];
    handleSettingChange('backgroundImages', updatedImages);
  };

  const handleRemoveCustomImage = (imageUrl: string) => {
    // 从背景图片中移除指定图片
    const updatedImages = settings.backgroundImages.filter(img => img !== imageUrl);
    handleSettingChange('backgroundImages', updatedImages.length > 0 ? updatedImages : []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 from-gray-900 to-gray-800 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 text-stone-100 font-playfair text-center mb-8">设置</h1>

        <div className="space-y-4">
          {/* 基本信息 */}
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-semibold text-stone-800 text-stone-100 mb-4">婚礼信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={settings.groomName}
                  onChange={(e) => handleSettingChange('groomName', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
                  placeholder="新郎姓名"
                />
                <input
                  type="text"
                  value={settings.brideName}
                  onChange={(e) => handleSettingChange('brideName', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
                  placeholder="新娘姓名"
                />
              </div>
              <input
                type="datetime-local"
                value={settings.weddingDate.slice(0, 16)}
                onChange={(e) => handleSettingChange('weddingDate', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
              />
              <textarea
                value={settings.weddingQuote}
                onChange={(e) => handleSettingChange('weddingQuote', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm resize-none"
                rows={3}
                placeholder="输入婚礼语录（显示在首页底部）"
              />
            </div>
          </div>

          {/* 背景设置 */}
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-semibold text-stone-800 text-stone-100 mb-4">背景设置</h2>

            {/* 背景预览 */}
            {settings.backgroundImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-stone-700 text-stone-300 mb-2">当前背景图片 ({settings.backgroundImages.length}/6)</p>
                <div className="grid grid-cols-3 gap-2">
                  {settings.backgroundImages.slice(0, 6).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`背景${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg"
                      />
                      <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 上传按钮 */}
            <button
              onClick={() => setShowBackgroundModal(true)}
              className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg transition-all text-sm hover:shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {settings.backgroundImages.length > 0 ? '管理背景图片' : '上传背景图片'}
            </button>

            <p className="text-xs text-stone-500 text-stone-400 text-center mt-2">
              最多可上传6张背景图片
            </p>
          </div>

  
          {/* 账户操作 */}
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-semibold text-stone-800 text-stone-100 mb-4">账户</h2>
            <div className="space-y-2">
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 border-stone-600 bg-white bg-stone-800 text-stone-700 text-stone-300 hover:bg-stone-50 hover:bg-stone-700 font-medium transition-all text-sm hover:shadow-sm active:scale-95"
              >
                🔄 重置设置
              </button>
              <button
                onClick={() => setIsConfirmingLogout(true)}
                className="w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium transition-all text-sm hover:shadow-sm active:scale-95"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>

        {/* 背景图片管理弹窗 */}
        {showBackgroundModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-stone-800 rounded-xl p-5 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl animate-fadeInUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-stone-800 text-stone-100">背景图片管理</h3>
                <button
                  onClick={() => setShowBackgroundModal(false)}
                  className="text-stone-500 hover:text-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                <ImageUpload
                  onImageSelect={handleImageUpload}
                  onImageRemove={handleRemoveCustomImage}
                  currentImages={settings.backgroundImages}
                  maxImages={6}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-200 border-stone-600">
                <button
                  onClick={() => setShowBackgroundModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 border-stone-600 bg-white bg-stone-800 text-stone-700 text-stone-300 hover:bg-stone-50 hover:bg-stone-700 font-medium transition-all text-sm hover:shadow-sm active:scale-95"
                >
                  完成
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 退出登录确认 */}
        {isConfirmingLogout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-stone-800 rounded-xl p-5 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-semibold text-stone-800 text-stone-100 mb-3">确认退出</h3>
              <p className="text-stone-600 text-stone-400 mb-4 text-sm">确定要退出登录吗？</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsConfirmingLogout(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-stone-300 border-stone-600 bg-white bg-stone-800 text-stone-700 text-stone-300 hover:bg-stone-50 hover:bg-stone-700 font-medium transition-all text-sm hover:shadow-sm active:scale-95"
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium transition-all text-sm hover:shadow-sm active:scale-95"
                >
                  确认退出
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
