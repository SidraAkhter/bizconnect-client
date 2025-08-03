import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

console.log("API Base URL:", baseURL);

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(options);

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    console.log("Request with credentials:", config.withCredentials);
    
    // Ensure cookies are always sent with requests
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("API Error:", error.message, error.response?.status, error.config?.url);
    
    const { data, status } = error.response || {};

    // Handle 401 Unauthorized errors by clearing the cookie and redirecting to login
    if (status === 401) {
      console.log("Unauthorized access - clearing cookies and redirecting to login");
      // Clear the auth cookie
      document.cookie = "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      // Only redirect if we're not already on the home/login page
      if (window.location.pathname !== "/" && 
          window.location.pathname !== "/sign-up" && 
          window.location.pathname !== "/login" && 
          window.location.pathname !== "/auth/google/callback") {
        console.log("Redirecting to login page due to auth error");
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
