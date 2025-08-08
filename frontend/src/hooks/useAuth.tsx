import { useState, useEffect, createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";
import api, { setAuthTokenUpdater } from "../api/axios";
import { loginUser, logout as logoutUser, refreshAccessToken, isTokenExpired } from "@/api/userApi";
import type { User } from "@/utils/type-user";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateToken: (newToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const updateToken = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  }, []);

  // Register the token updater with axios interceptor
  useEffect(() => {
    setAuthTokenUpdater(updateToken);
  }, [updateToken]);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Check if token is expired before making the request
    if (isTokenExpired(token)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            updateToken(newToken);
            // Continue with loading user
          } else {
            // Refresh failed, clear everything
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setIsLoading(false);
            return;
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          setIsLoading(false);
          return;
        }
      } else {
        // No refresh token, clear everything
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error: any) {
      console.error('Failed to load user:', error);
      
      // If it's a 401 error, try to refresh the token
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              updateToken(newToken);
              // Retry loading user with new token
              const res = await api.get("/users/me");
              setUser(res.data);
              setIsLoading(false);
              return;
            }
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
          }
        }
      }
      
      // If refresh failed or no refresh token, clear everything
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    } finally {
      setIsLoading(false);
    }
  }, [token, updateToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await loginUser(email, password);
      setToken(res.access_token);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      await loadUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
