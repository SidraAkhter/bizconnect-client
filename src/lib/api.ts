import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CustomError } from "@/types/custom-error.type";

// Optional: Define shape of error response
interface ErrorResponseData {
  errorCode?: string;
  message?: string;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

console.log("API Base URL:", baseURL);

const options: AxiosRequestConfig = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const API = axios.create(options);

// Request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Request with credentials:", config.withCredentials);

    // Ensure cookies are always sent
    config.withCredentials = true;
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with safe typing
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  async (error: AxiosError<ErrorResponseData>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    console.error("API Error:", error.message, status, error.config?.url);

    // Handle Unauthorized
    if (status === 401) {
      console.log("Unauthorized - clearing cookie and redirecting to login");
      document.cookie = "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      const path = window.location.pathname;
      if (
        path !== "/" &&
        path !== "/sign-up" &&
        path !== "/login" &&
        path !== "/auth/google/callback"
      ) {
        window.location.href = "/";
      }
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;
