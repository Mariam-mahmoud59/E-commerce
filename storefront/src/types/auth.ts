export interface LoginRequest {
  email: string;
  password: string; 
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string; 
  phone: string;
  preferredLanguage: string;
}

export interface AuthResponse {
  id: string;
  token: string;
  fullName: string;
  email: string;
  roles: string[];
}
