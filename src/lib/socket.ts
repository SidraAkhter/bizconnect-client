import { io } from "socket.io-client";

// Use environment variable instead of hardcoding localhost
export const socket = io(import.meta.env.VITE_API_URL as string, {
  withCredentials: true,
});
