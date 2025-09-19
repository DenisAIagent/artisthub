import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
const API_PREFIX = '/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token for authenticated requests
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('artisthub_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: Add proper error handling, token refresh, etc.
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Types
export interface DashboardMetric {
  label: string;
  value: string;
  change: string;
  breakdown: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface RecentActivity {
  time: string;
  action: string;
  detail: string;
  artist: string;
  type: 'info' | 'success' | 'warning' | 'error';
  metadata?: object;
}

export interface QuickAction {
  label: string;
  href: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  artistsAccess: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Dashboard API
export const dashboardApi = {
  // Get dashboard metrics based on user role
  getMetrics: async (artistId?: string): Promise<DashboardMetric[]> => {
    const params = artistId ? { artistId } : {};
    const response = await apiClient.get<ApiResponse<{ metrics: DashboardMetric[] }>>('/dashboard/metrics', { params });
    return response.data.data.metrics;
  },

  // Get recent activities
  getRecentActivities: async (artistId?: string, limit = 10): Promise<RecentActivity[]> => {
    const params = { limit, ...(artistId ? { artistId } : {}) };
    const response = await apiClient.get<ApiResponse<RecentActivity[]>>('/dashboard/activities', { params });
    return response.data.data;
  },

  // Get quick actions for current user
  getQuickActions: async (): Promise<QuickAction[]> => {
    const response = await apiClient.get<ApiResponse<QuickAction[]>>('/dashboard/quick-actions');
    return response.data.data;
  },

  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/dashboard/user-profile');
    return response.data.data;
  },
};

// Artists API
export interface Artist {
  id: number;
  name: string;
  genre: string;
  followers: number;
  status: string;
}

export const artistsApi = {
  // Get all artists
  getArtists: async (): Promise<Artist[]> => {
    const response = await apiClient.get<{ artists: Artist[] }>('/artists');
    return response.data.artists;
  },

  // Get artist by ID (for future use)
  getArtist: async (id: string): Promise<Artist> => {
    const response = await apiClient.get<Artist>(`/artists/${id}`);
    return response.data;
  },
};

// Health check API
export const healthApi = {
  checkStatus: async () => {
    const response = await apiClient.get('/test-db');
    return response.data;
  },
};

// Export default instance
export default apiClient;