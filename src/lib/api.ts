// API客户端工具函数

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// 获取认证token
const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 通用请求函数
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    headers.set('Authorization', authHeader.Authorization);
  }

  if (options.headers) {
    const additionalHeaders = options.headers as Record<string, string>;
    Object.entries(additionalHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  const config: RequestInit = {
    headers,
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// GET请求
export async function apiGet<T>(url: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(url, { method: 'GET', ...options });
}

// POST请求
export async function apiPost<T>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

// PUT请求
export async function apiPut<T>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });
}

// DELETE请求
export async function apiDelete<T>(url: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(url, { method: 'DELETE', ...options });
}