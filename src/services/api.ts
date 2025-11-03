/**
 * API 服務 - 連接 Java Spring Boot 後端
 * 支援自動 Token 刷新機制
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API 錯誤處理
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token 管理
const TokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};

// Token 刷新鎖（防止並發刷新）
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 刷新 Access Token
async function refreshAccessToken(): Promise<string> {
  const refreshToken = TokenManager.getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    TokenManager.clearTokens();
    throw new Error('Unable to refresh token');
  }

  const data = await response.json();
  TokenManager.setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

// 通用請求函數（支援自動 Token 刷新）
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = TokenManager.getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 處理 401 Unauthorized - 嘗試刷新 Token
  if (response.status === 401 && !isRetry) {
    if (isRefreshing) {
      // 如果正在刷新，將請求加入隊列
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        return request<T>(endpoint, options, true);
      });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      isRefreshing = false;
      
      // 使用新 Token 重試請求
      return request<T>(endpoint, options, true);
    } catch (error) {
      processQueue(error, null);
      isRefreshing = false;
      
      // 刷新失敗，跳轉到登入頁
      TokenManager.clearTokens();
      window.location.href = '/';
      throw error;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(
      response.status,
      errorData.message || errorData.error || 'Request failed'
    );
  }

  // 處理 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// 認證 API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await request<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // 保存 Tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    gender?: string;
    age?: number;
    patientId?: string;
  }) => {
    const response = await request<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // 保存 Tokens
    TokenManager.setTokens(response.accessToken, response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  },

  refresh: async (refreshToken: string) => {
    const response = await request<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      user: any;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return response;
  },

  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      TokenManager.clearTokens();
    }
  },

  health: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/health`);
    return response.text();
  },
};

// 頭痛日誌 API
export const headacheLogApi = {
  create: async (data: {
    userId: number;
    logDate: string;
    intensity: number;
    symptoms?: string;
    medication?: string;
    notes?: string;
    durationHours?: number;
    location?: string;
    triggers?: string;
  }) => {
    return request('/headache-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyLogs: async (userId: number) => {
    return request(`/headache-logs/my-logs?userId=${userId}`, {
      method: 'GET',
    });
  },

  getByDateRange: async (userId: number, startDate: string, endDate: string) => {
    return request(
      `/headache-logs/date-range?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
      { method: 'GET' }
    );
  },

  update: async (id: number, data: any) => {
    return request(`/headache-logs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number) => {
    return request(`/headache-logs/${id}`, {
      method: 'DELETE',
    });
  },
};

// 健康量表 API
export const healthScaleApi = {
  create: async (data: {
    userId: number;
    scaleType: string;
    testDate: string;
    score: number;
    level?: string;
    answers?: string;
    interpretation?: string;
  }) => {
    return request('/health-scales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getUserScales: async (userId: number) => {
    return request(`/health-scales/user/${userId}`, {
      method: 'GET',
    });
  },

  getUserScalesByType: async (userId: number, scaleType: string) => {
    return request(`/health-scales/user/${userId}/type/${scaleType}`, {
      method: 'GET',
    });
  },
};

export { ApiError };
