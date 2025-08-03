import { io } from "socket.io-client";

console.log("API URL is:", import.meta.env.VITE_API_URL); // 👈 Add this here

export const socket = io(import.meta.env.VITE_API_URL as string, {
  withCredentials: true,
});
