import { io } from "socket.io-client";

// Replace with your actual backend base URL if needed
export const socket = io("http://localhost:5000", {
  withCredentials: true,
});
