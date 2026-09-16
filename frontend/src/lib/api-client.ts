import axios from "axios";

/**
 * Configured Axios instance for the Go backend API.
 *
 * - Base URL from environment variable
 * - JWT token injection from localStorage
 * - Automatic 401 → redirect to login
 * - Standardized error extraction
 */
/**
 * Dynamically resolves the backend API URL.
 * In browser on remote servers (e.g. tempcse.nith.ac.in), routes to /backend/api/v1 so Nginx handles proxying.
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return "/backend/api/v1";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "/backend/api/v1";
}

const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token and ensure correct baseURL
apiClient.interceptors.request.use(
  (config) => {
    config.baseURL = getApiUrl();
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("admin_token");
      if (token && token.trim() && token !== "null" && token !== "undefined") {
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
    const isLoginEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginEndpoint && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");

      // Determine which portal we're on for redirect (avoid reloading if already on login page)
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        window.location.href = `/admin/login?error=session_expired&redirect=${encodeURIComponent(path)}`;
      } else if (path.startsWith("/faculty") && path !== "/faculty/login") {
        window.location.href = `/faculty/login?error=session_expired&redirect=${encodeURIComponent(path)}`;
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
