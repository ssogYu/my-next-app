"use client";

import { useState, useEffect } from 'react';
import { useWeddingSettings } from "@/hooks/useWeddingSettings";
import { WeddingSettings } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "@/components/ImageUpload";

export default function SettingPage() {
  const { settings, updateSettings, resetSettings, loading, error } = useWeddingSettings();
  const { logout } = useAuth();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  // 本地表单状态
  const [formData, setFormData] = useState<WeddingSettings>(settings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 当原始设置数据加载完成后，同步本地表单状态
  useEffect(() => {
    if (settings && !loading) {
      setFormData(settings);
      setHasUnsavedChanges(false);
    }
  }, [settings, loading]);

  // 添加页面离开提醒
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSettingChange = (key: keyof WeddingSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);

      await updateSettings(formData);
      setHasUnsavedChanges(false);
      setSaveSuccess(true);

      // 3秒后隐藏成功提示
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('保存失败:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？这将清除所有当前配置。')) {
      resetSettings();
      setFormData(settings);
      setHasUnsavedChanges(false);
    }
  };

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      const confirmLogout = confirm('您有未保存的更改。确定要退出登录吗？未保存的更改将会丢失。');
      if (!confirmLogout) {
        setIsConfirmingLogout(false);
        return;
      }
    }
    logout();
    setIsConfirmingLogout(false);
  };

  
  
  const handleImageUpload = (imageUrl: string) => {
    // 将新上传的图片添加到现有背景图片中
    const updatedImages = [...formData.backgroundImages, imageUrl];
    handleSettingChange('backgroundImages', updatedImages);
  };

  const handleRemoveCustomImage = (imageUrl: string) => {
    // 从背景图片中移除指定图片
    const updatedImages = formData.backgroundImages.filter(img => img !== imageUrl);
    handleSettingChange('backgroundImages', updatedImages.length > 0 ? updatedImages : []);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 from-gray-900 to-gray-800 p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 text-stone-100 font-playfair text-center mb-8">设置</h1>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            加载设置失败: {error}
          </div>
        )}

        {/* 成功提示 */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in">
            ✅ 设置保存成功！
          </div>
        )}

        <div className="space-y-4">
          {/* 基本信息 */}
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-semibold text-stone-800 text-stone-100 mb-4">婚礼信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.groomName}
                  onChange={(e) => handleSettingChange('groomName', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
                  placeholder="新郎姓名"
                />
                <input
                  type="text"
                  value={formData.brideName}
                  onChange={(e) => handleSettingChange('brideName', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
                  placeholder="新娘姓名"
                />
              </div>
              <input
                type="datetime-local"
                value={formData.weddingDate.slice(0, 16)}
                onChange={(e) => handleSettingChange('weddingDate', new Date(e.target.value).toISOString())}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 border-stone-600 bg-white bg-stone-800 text-stone-800 text-stone-200 focus:border-rose-300 focus:outline-none transition-all text-sm"
              />
              <textarea
                value={formData.weddingQuote}
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
            {formData.backgroundImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-stone-700 text-stone-300 mb-2">当前背景图片 ({formData.backgroundImages.length}/6)</p>
                <div className="grid grid-cols-3 gap-2">
                  {formData.backgroundImages.slice(0, 6).map((image, index) => (
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
              {formData.backgroundImages.length > 0 ? '管理背景图片' : '上传背景图片'}
            </button>

            <p className="text-xs text-stone-500 text-stone-400 text-center mt-2">
              最多可上传6张背景图片
            </p>
          </div>

  
          {/* 保存按钮 */}
          <div className="glass-panel rounded-xl p-5">
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving || loading}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-sm hover:shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                  !hasUnsavedChanges || isSaving || loading
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    保存中...
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                    </svg>
                    保存设置
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    已保存
                  </>
                )}
              </button>

              {hasUnsavedChanges && (
                <p className="text-xs text-amber-600 text-center animate-pulse">
                  ⚠️ 您有未保存的更改
                </p>
              )}
            </div>
          </div>

          {/* 账户操作 */}
          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-lg font-semibold text-stone-800 text-stone-100 mb-4">账户</h2>
            <div className="space-y-2">
              <button
                onClick={handleReset}
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
                  currentImages={formData.backgroundImages}
                  maxImages={6}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-stone-200 border-stone-600">
                <button
                  onClick={() => {
                    setShowBackgroundModal(false);
                    if (hasUnsavedChanges) {
                      // 如果有未保存的更改，提醒用户
                      setTimeout(() => {
                        alert('请记得点击"保存设置"按钮来保存您的更改！');
                      }, 100);
                    }
                  }}
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
