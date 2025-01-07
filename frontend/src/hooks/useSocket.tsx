import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found in localStorage");
      return;
    }

    socket.current = io("http://localhost:3000", {
      auth: {
        token,
      },
    });

    socket.current.on("connect", () => {
      console.log("WebSocket connected:", socket.current?.id);
    });

    socket.current.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return () => {
      socket.current?.disconnect();
      console.log("WebSocket connection closed");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
