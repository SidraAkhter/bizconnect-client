import { io } from "socket.io-client";

// Use a dedicated VITE_SOCKET_URL (no need to strip /api anymore)
const socketURL = import.meta.env.VITE_SOCKET_URL as string;

console.log("Socket connecting to:", socketURL);

export const socket = io(socketURL, {
  withCredentials: true,
  transports: ["websocket"],
});
