import { io } from "socket.io-client";

const socket = io('https://barbershop-backend-ozy5.onrender.com',{ autoConnect: false });

export default socket