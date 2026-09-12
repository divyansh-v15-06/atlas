import axios from "axios";

/**
 * Configured Axios instance for the Go backend API.
 *
 * - Base URL from environment variable
 * - JWT token injection from localStorage
 * - Automatic 401 → redirect to login
 * - Standardized error extraction
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginEndpoint && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // Determine which portal we're on for redirect (avoid reloading if already on login page)
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        window.location.href = "/admin/login";
      } else if (path.startsWith("/faculty") && path !== "/faculty/login") {
        window.location.href = "/faculty/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 * Type for standardized API error responses from Go backend.
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Type for standardized API success responses from Go backend.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Extract user-facing error message from an Axios error.
 */
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiErr = error.response?.data as ApiError | undefined;
    if (apiErr?.error?.message) {
      return apiErr.error.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}
