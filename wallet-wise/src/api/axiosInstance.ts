import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://walletwise-4.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Flag to track token refreshing state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("walletwise_access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expired (401) and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "success" in response.data && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      console.error("Network Error: Could not connect to the API. It might be offline or blocked by CORS.");
      return Promise.reject(new Error("Network Error: Unable to connect to the server. Please check your connection or CORS settings."));
    }

    if (error.code === "ERR_NETWORK") {
      return Promise.reject(new Error("Network Error: Connection refused or CORS policy blocked the request."));
    }

    // Check if error is 401 (Unauthorized) and request has not already been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh")) {
        // Don't retry auth paths to prevent infinite loops
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("walletwise_refresh_token");
      if (!refreshToken) {
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("walletwise_access_token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("walletwise_refresh_token", newRefreshToken);
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        handleSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    // Extract exact backend message if available instead of generic Axios error
    if (error.response && error.response.data && typeof error.response.data === "object") {
      const backendMessage = (error.response.data as any).message;
      if (backendMessage) {
        return Promise.reject(new Error(backendMessage));
      }
    }

    return Promise.reject(error);
  }
);

// Helper to log out on session expiry
const handleSessionExpired = () => {
  localStorage.removeItem("walletwise_access_token");
  localStorage.removeItem("walletwise_refresh_token");
  localStorage.removeItem("walletwise_user");
  
  // Dispatch custom event to notify App to log out
  window.dispatchEvent(new Event("walletwise_session_expired"));
};

export default axiosInstance;
