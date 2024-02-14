import { io } from "socket.io-client";

const socket = io('https://barbershop-backend-ozy5.onrender.com');

socket.on('connect', () => {
    console.log('Socket is connected');
  });

  socket.on('connect', () => {
    console.log('Socket is connected');
  });

export default socket