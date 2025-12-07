import { apiGet, apiPut, apiDelete } from '@/lib/api';
import { WeddingSettings, WeddingSettingsRequest, WeddingSettingsResponse } from '@/lib/types';

export class WeddingSettingsService {
  private static baseUrl = '/api/wedding-settings';

  static async getSettings(): Promise<WeddingSettings | null> {
    try {
      const response = await apiGet<WeddingSettingsResponse>(this.baseUrl);
      return response.data || null;
    } catch (error) {
      console.error('获取婚礼设置失败:', error);
      throw error;
    }
  }

  static async updateSettings(updates: WeddingSettingsRequest): Promise<WeddingSettings> {
    try {
      const response = await apiPut<WeddingSettingsResponse>(this.baseUrl, updates);
      if (!response.data) {
        throw new Error('更新婚礼设置失败');
      }
      return response.data;
    } catch (error) {
      console.error('更新婚礼设置失败:', error);
      throw error;
    }
  }

  static async deleteSettings(): Promise<void> {
    try {
      await apiDelete(this.baseUrl);
    } catch (error) {
      console.error('删除婚礼设置失败:', error);
      throw error;
    }
  }
}