"use client";

import { useState } from 'react';

export interface WeddingSettings {
  brideName: string;
  groomName: string;
  weddingDate: string;
  backgroundImages: string[];
  theme: 'light' | 'dark';
  weddingQuote: string;
}

const DEFAULT_SETTINGS: WeddingSettings = {
  brideName: '新娘',
  groomName: '新郎',
  weddingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 默认一年后
  backgroundImages: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1516571749851-9cf07e95ff23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
  ],
  theme: 'light',
  weddingQuote: '执子之手，与子偕老'
};

export function useWeddingSettings() {
  const [settings, setSettings] = useState<WeddingSettings>(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('weddingSettings');
      if (savedSettings) {
        try {
          return JSON.parse(savedSettings);
        } catch (error) {
          console.error('Error parsing wedding settings:', error);
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<WeddingSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('weddingSettings', JSON.stringify(updatedSettings));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('weddingSettings');
  };

  return { settings, updateSettings, resetSettings };
}