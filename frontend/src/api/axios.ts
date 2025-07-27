import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
// Queue to hold requests that failed due to token expiration
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing the token, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        import('./userApi')
          .then(({ refreshAccessToken }) => refreshAccessToken())
          .then((newToken) => {
            if (newToken) {
              // Update the authorization header with the new token
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              
              // Process the queue with the new token
              processQueue(null, newToken);
              
              // Retry the original request
              resolve(api(originalRequest));
            } else {
              // If refresh token is invalid or expired, log the user out
              processQueue(new Error('Failed to refresh token'));
              localStorage.removeItem('token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/';
              reject(error);
            }
          })
          .catch((err) => {
            processQueue(err);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/';
            reject(error);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // If the error is not a 401 or we've already tried to refresh the token
    return Promise.reject(error);
  }
);

export default api; 