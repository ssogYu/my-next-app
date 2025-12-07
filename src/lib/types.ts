export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  token?: string;
}

// Wedding Settings Types
export interface WeddingSettings {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  backgroundImages: string[];
  theme: 'light' | 'dark';
  weddingQuote: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingSettingsRequest {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  backgroundImages?: string[];
  theme?: 'light' | 'dark';
  weddingQuote?: string;
}

export interface WeddingSettingsResponse {
  success: boolean;
  message?: string;
  data?: WeddingSettings | null;
}

// Todo Category Types
export interface TodoCategory {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TodoCategoryRequest {
  name: string;
  color?: string;
  icon?: string;
  order?: number;
}

export interface TodoCategoryResponse {
  success: boolean;
  message?: string;
  data?: TodoCategory | TodoCategory[] | null;
}

// Todo Types
export interface Todo {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
  categoryId: string;
  priority: 'high' | 'medium' | 'low';
  parentId?: string;
  notes?: string;
  dueDate?: string;
  updatedAt: string;
  children?: Todo[];
}

export interface TodoRequest {
  text: string;
  categoryId?: string;
  priority?: 'high' | 'medium' | 'low';
  parentId?: string;
  notes?: string;
  dueDate?: string;
}

export interface TodoResponse {
  success: boolean;
  message?: string;
  data?: Todo[] | null;
}

export interface SingleTodoResponse {
  success: boolean;
  message?: string;
  data?: Todo | null;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  byCategory: Record<string, { total: number; completed: number; pending: number }>;
}

export interface TodoStatsResponse {
  success: boolean;
  message?: string;
  data?: TodoStats | null;
}