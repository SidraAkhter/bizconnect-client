import { io } from "socket.io-client";

// Remove trailing "/api" from the URL for socket connection
const baseSocketURL = (import.meta.env.VITE_API_URL as string).replace("/api", "");

console.log("Socket connecting to:", baseSocketURL);

export const socket = io(baseSocketURL, {
  withCredentials: true,
  transports: ["websocket"], // Force WebSocket (optional but recommended)
});
