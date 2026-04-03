import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for local dev
    methods: ["GET", "POST"]
  }
});

let chatHistory = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send history to new users
  socket.emit('chat_history', chatHistory);

  socket.on('send_message', (data) => {
    // data should contain { username, text }
    const message = {
      id: Date.now().toString(),
      username: data.username || 'Anonymous',
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    chatHistory.push(message);
    
    // Limits history strictly to 50 items
    if (chatHistory.length > 50) {
      chatHistory.shift();
    }

    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on port ${PORT}`);
});
