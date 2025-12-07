"use client";

import { useState, useEffect } from 'react';
import { WeddingSettings } from '@/lib/types';
import { WeddingSettingsService } from '@/services/weddingSettingsService';

const DEFAULT_SETTINGS: WeddingSettings = {
  id: '',
  brideName: '新娘',
  groomName: '新郎',
  weddingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 默认一年后
  backgroundImages: [
  ],
  theme: 'light',
  weddingQuote: '执子之手，与子偕老',
  userId: '',
  createdAt: '',
  updatedAt: '',
};

export function useWeddingSettings() {
  const [settings, setSettings] = useState<WeddingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await WeddingSettingsService.getSettings();
      if (data) {
        setSettings(data);
      } else {
        // 如果没有设置，使用默认设置
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('加载婚礼设置失败:', err);
      setError(err instanceof Error ? err.message : '加载失败');
      // 发生错误时使用默认设置
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<WeddingSettings>) => {
    try {
      setError(null);
      // 如果没有ID，说明是首次创建，需要包含所有默认值
      const updates = !settings.id
        ? { ...DEFAULT_SETTINGS, ...newSettings }
        : newSettings;

      const updatedSettings = await WeddingSettingsService.updateSettings(updates);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('更新婚礼设置失败:', err);
      setError(err instanceof Error ? err.message : '更新失败');
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      setError(null);
      if (settings.id) {
        await WeddingSettingsService.deleteSettings();
      }
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('重置婚礼设置失败:', err);
      setError(err instanceof Error ? err.message : '重置失败');
      throw err;
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    loading,
    error,
    refetch: loadSettings
  };
}