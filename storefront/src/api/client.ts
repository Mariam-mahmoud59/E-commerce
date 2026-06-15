import i18n from '../i18n';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5191/api';

// Maintain a reference to the access token in memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard fetch wrapper that automatically handles:
 * - JWT Authorization headers
 * - Accept-Language headers
 * - 401 Unauthorized retries (refresh token flow)
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept-Language', i18n.language || 'en');
  
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for sending/receiving HTTP-only cookies
  };

  let response = await fetch(url, config);

  // If 401, attempt silent refresh
  if (response.status === 401 && endpoint !== '/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n.language || 'en'
        },
        credentials: 'include'
      });
      
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setAccessToken(refreshData.token);
        
        // Retry original request with new token
        headers.set('Authorization', `Bearer ${refreshData.token}`);
        config.headers = headers;
        response = await fetch(url, config);
      }
    } catch (refreshErr) {
      // Refresh failed, let the 401 pass through
    }
  }

  // Handle errors
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    let errorData;
    try {
      errorData = await response.json();
      if (Array.isArray(errorData)) {
        errorMessage = errorData.map((e: any) => e.description).join(', ');
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        const firstErrorKey = Object.keys(errorData.errors)[0];
        errorMessage = errorData.errors[firstErrorKey][0];
      }
    } catch {
      // Ignored
    }
    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Handle empty responses (like 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}
