import http from "http";
import express from "express";
import { Server } from 'socket.io';

const port = 8000;

// Spinning the http server and the websocket server.
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
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

