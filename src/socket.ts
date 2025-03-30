import { io } from "socket.io-client";

// Use your Render backend URL
export const socket = io("https://project-mnrx.onrender.com", {
  autoConnect: false,
  transports: ["websocket"], // Ensures WebSocket is used
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log("Socket connected");
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
