import { type createUser } from '@/utils/type-user';
import api from './axios'; 



export const registerUser = async (user: createUser) => {
  const response = await api.post("/auth/", user);
  return response.data;
};

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const loginUser = async (email: string, password: string): Promise<TokenResponse> => {
  const params = new URLSearchParams();
  params.append("username", email);
  params.append("password", password);
  const res = await api.post<TokenResponse>("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const changePassword = async (form: {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}) => {
  const response = await api.put("/users/change-password", form);
  return response.data;
};

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.warn('No refresh token found in localStorage');
      return null;
    }

    console.log('Attempting to refresh access token...');
    const response = await api.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken });

    if (response.data.access_token && response.data.refresh_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      console.log('Successfully refreshed access token');
      return response.data.access_token;
    } else {
      console.error('Invalid response from refresh endpoint');
      return null;
    }
  } catch (error: any) {
    console.error('Failed to refresh token:', error);

    // If it's a 401 or 403, the refresh token is invalid
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Refresh token is invalid or expired');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }

    return null;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }
};
