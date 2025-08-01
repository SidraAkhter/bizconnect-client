import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { CustomError } from "@/types/custom-error.type";

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

API.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
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
