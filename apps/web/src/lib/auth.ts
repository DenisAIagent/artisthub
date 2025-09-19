import { apiClient } from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'artist' | 'manager' | 'admin';
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'artist' | 'manager' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  expiresIn: string;
}

class AuthService {
  private tokenKey = 'artisthub_token';
  private userKey = 'artisthub_user';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data.success) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.data.success) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
    return response.data.user;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Logout endpoint might fail, but we still want to clear local storage
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
    // Set authorization header for future requests
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    delete apiClient.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  initializeAuth(): void {
    // Set token in axios header if it exists
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export const authService = new AuthService();

// Initialize auth on import
if (typeof window !== 'undefined') {
  authService.initializeAuth();
}