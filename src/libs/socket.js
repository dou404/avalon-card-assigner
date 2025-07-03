import { io } from "socket.io-client";

const userNameStorage = localStorage.getItem("userName") || "";

export let socket = io(import.meta.env.VITE_SERVER_URL, {
  query: { userName: userNameStorage, isNew: "FALSE" },
});

export const connectSocket = (userName, isNew) => {
  socket = io(import.meta.env.VITE_SERVER_URL, {
    query: { userName, isNew },
    transports: ["websocket"],
  });
};
