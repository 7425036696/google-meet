const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store room information
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        participants: new Set(),
        messages: []
      });
    }
    
    const room = rooms.get(roomId);
    room.participants.add(socket.id);
    
    // Notify others in the room
    socket.to(roomId).emit("user-joined", socket.id);
    
    // Send existing messages to the new user
    socket.emit("chat-history", room.messages);
    
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", ({ to, offer }) => {
    socket.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    socket.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    socket.to(to).emit("ice-candidate", { from: socket.id, candidate });
  });

  socket.on("chat-message", ({ to, from, message, timestamp }) => {
    const room = rooms.get(to);
    if (room) {
      const messageData = { from, message, timestamp };
      room.messages.push(messageData);
      
      // Broadcast to all users in the room except sender
      socket.to(to).emit("chat-message", messageData);
    }
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if (room) {
      room.participants.delete(socket.id);
      
      // If room is empty, clean it up
      if (room.participants.size === 0) {
        rooms.delete(roomId);
      }
    }
    
    socket.to(roomId).emit("user-left", socket.id);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Remove user from all rooms
    rooms.forEach((room, roomId) => {
      if (room.participants.has(socket.id)) {
        room.participants.delete(socket.id);
        socket.to(roomId).emit("user-left", socket.id);
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

// API endpoint to get room info
app.get("/api/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms.get(roomId);
  
  if (room) {
    res.json({
      exists: true,
      participants: room.participants.size,
      messages: room.messages.length
    });
  } else {
    res.json({
      exists: false,
      participants: 0,
      messages: 0
    });
  }
});

server.listen(4000, () => {
  console.log("🚀 Server running at http://localhost:4000");
});