import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { apiClient } from './client';

export const authApi = {
  login: (data: LoginRequest) => 
    apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) => 
    apiClient<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: () => 
    apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
    }),

  logout: (token: string) => 
    apiClient<void>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
};
