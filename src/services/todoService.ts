import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import {
  Todo,
  TodoRequest,
  TodoResponse,
  SingleTodoResponse,
  TodoCategory,
  TodoStats,
  TodoStatsResponse
} from '@/lib/types';

export class TodoService {
  private static baseUrl = '/api/todos';
  private static categoriesUrl = '/api/todo-categories';

  // Todo相关方法
  static async getTodos(categoryId?: string): Promise<Todo[]> {
    try {
      const url = categoryId ? `${this.baseUrl}?categoryId=${categoryId}` : this.baseUrl;
      const response = await apiGet<TodoResponse>(url);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  }

  static async getTodo(id: string): Promise<Todo> {
    try {
      const response = await apiGet<SingleTodoResponse>(`${this.baseUrl}/${id}`);
      if (!response.data) {
        throw new Error('任务不存在');
      }
      return response.data;
    } catch (error) {
      console.error('获取任务失败:', error);
      throw error;
    }
  }

  static async createTodo(todoData: TodoRequest): Promise<Todo> {
    try {
      const response = await apiPost<SingleTodoResponse>(this.baseUrl, todoData);
      if (!response.data) {
        throw new Error('创建任务失败');
      }
      return response.data;
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
  }

  static async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      const response = await apiPut<SingleTodoResponse>(`${this.baseUrl}/${id}`, updates);
      if (!response.data) {
        throw new Error('更新任务失败');
      }
      return response.data;
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  }

  static async deleteTodo(id: string): Promise<void> {
    try {
      await apiDelete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error;
    }
  }

  static async getTodoStats(): Promise<TodoStats> {
    try {
      const response = await apiGet<TodoStatsResponse>(`${this.baseUrl}?stats=true`);
      if (!response.data) {
        throw new Error('获取任务统计失败');
      }
      return response.data;
    } catch (error) {
      console.error('获取任务统计失败:', error);
      throw error;
    }
  }

  // Todo Category相关方法
  static async getCategories(): Promise<TodoCategory[]> {
    try {
      const response = await apiGet<any>(this.categoriesUrl);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('获取任务分类失败:', error);
      throw error;
    }
  }

  static async createCategory(categoryData: {
    name: string;
    color?: string;
    icon?: string;
    order?: number;
  }): Promise<TodoCategory> {
    try {
      const response = await apiPost<any>(this.categoriesUrl, categoryData);
      if (!response.data) {
        throw new Error('创建分类失败');
      }
      return response.data;
    } catch (error) {
      console.error('创建分类失败:', error);
      throw error;
    }
  }

  static async updateCategory(id: string, updates: Partial<TodoCategory>): Promise<TodoCategory> {
    try {
      const response = await apiPut<any>(`${this.categoriesUrl}/${id}`, updates);
      if (!response.data) {
        throw new Error('更新分类失败');
      }
      return response.data;
    } catch (error) {
      console.error('更新分类失败:', error);
      throw error;
    }
  }

  static async deleteCategory(id: string): Promise<void> {
    try {
      await apiDelete(`${this.categoriesUrl}/${id}`);
    } catch (error) {
      console.error('删除分类失败:', error);
      throw error;
    }
  }
}