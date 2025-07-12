// app/api/socket/route.js
import { Server } from "socket.io";

let io;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🧠 Creating Socket.IO server...");
    io = new Server(res.socket.server, {
      path: "/api/socket", // important: custom path
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ New client connected:", socket.id);
      
      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  }

  res.end();
}
