// src/SocketContext.js
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../store';
import { Socket } from 'socket.io-client';
import { io } from "socket.io-client";


interface SocketContextType {
    socket: Socket;
  }

  interface SocketProviderProps {
    children: ReactNode;
  }

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
      throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
  };
  const socket = io('https://barbershop-backend-ozy5.onrender.com');
  export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const {user, token} = useAppSelector((state: RootState) => state.auth);
    
    useEffect(() => {
      socket.on('connect', () => {
        console.log("context 1", socket.id)
      console.log("socket id", socket.connected)
        console.log("emit log-in")
        socket.emit('log-in', {
          user: {
            _id: user?._id,
          },
        });    });

    socket.on('disconnect', (reason) => {
      console.log("socket disconnected", reason)
    });

    return () => {
      console.log("return")
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext