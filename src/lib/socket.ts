import { io } from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL;

console.log("Socket connecting to:", socketURL);

export const socket = io(socketURL, {
  withCredentials: true,
  transports: ["websocket"],
});
