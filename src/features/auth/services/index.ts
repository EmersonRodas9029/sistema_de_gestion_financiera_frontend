import { apiFetch } from '../../../lib/api';

export interface LoginResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
  rol: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null) as ApiError | null;
      throw new Error(body?.message || 'Credenciales inválidas');
    }
    return res.json();
  },
};
