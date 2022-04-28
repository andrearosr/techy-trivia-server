import http from "http";
import express from "express";
import cors from "cors";
import { Server } from 'socket.io';

const port = 8000;

// Spinning the http server and the websocket server.
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://192.168.1.5:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://techy-trivia.herokuapp.com',
    ],
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('ready', () => {
    console.log('ready')
    io.emit('start');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port);

