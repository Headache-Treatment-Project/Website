/**
 * API 服務 - 連接 Java Spring Boot 後端
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API 錯誤處理
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用請求函數
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || errorData.error || 'Request failed');
  }

  return response.json();
}

// 認證 API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await request<{
      token: string;
      type: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
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
      token: string;
      type: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
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
