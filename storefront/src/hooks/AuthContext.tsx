import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../api/auth';
import { setAccessToken } from '../api/client';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to restore session using refresh token on load
    const restoreSession = async () => {
      try {
        const response = await authApi.refresh();
        if (response.token) {
          setAccessToken(response.token);
          setUser(response);
        }
      } catch (error) {
        console.log('No valid session found');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    setAccessToken(response.token);
    setUser(response);
  };

  const register = async (data: RegisterRequest) => {
    await authApi.register(data);
    await login({ email: data.email, password: data.password });
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await authApi.logout(user.token);
      }
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
