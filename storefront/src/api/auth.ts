import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:5191/api';

/**
 * Standard fetch wrapper for authentication requests
 */
async function fetchApi<T>(endpoint: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Required to send/receive HTTP-only refresh token cookies
    credentials: 'omit', // Wait, ASP.NET Core Cors default doesn't allow credentials unless specified. Let's start with omit, but for cookies it must be 'include'. I will use 'include'.
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Standard fetch wrapper for authentication requests
 */
async function fetchApiWithCredentials<T>(endpoint: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData)) {
        // Identity returns an array of errors: [{ code, description }]
        errorMessage = errorData.map(e => e.description).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        // Handle validation errors from ASP.NET Core
        const firstErrorKey = Object.keys(errorData.errors)[0];
        errorMessage = errorData.errors[firstErrorKey][0];
      }
    } catch {
      // Ignored
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}


export const authApi = {
  login: (data: LoginRequest) => 
    fetchApiWithCredentials<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) => 
    fetchApiWithCredentials<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  refresh: () => 
    fetchApiWithCredentials<AuthResponse>('/auth/refresh', {
      method: 'POST',
    }),

  logout: (token: string) => 
    fetchApiWithCredentials<void>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
};
