import http from "http";
import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { v4 as uuid } from 'uuid';

const port = process.env.PORT || 8000;

// Spinning the http server and the websocket server.
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Techy Server</h1>');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://172.21.0.63:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://techy-trivia.herokuapp.com',
    ],
  }
});

let players = {}

io.on('connection', (socket) => {
  console.log('a user connected');

  // Game events
  
  socket.on('player_joined', (name) => {
    const playerId = uuid();
    players[playerId] = {
      name,
      points: 0,
    };

    socket.emit('player_added', playerId);
  });

  socket.on('ready', () => {
    console.log('ready')
    io.emit('start');
  });

  socket.on('player_answer', ({ id, point = 0 }) => {
    players[id].points = players[id].points + point;
    console.log(players);
  });

  socket.on('end', () => {
    const leaderboard = Object.values(players).sort((a, b) => b.points - a.points);
    socket.emit('game_ended', leaderboard);
  });

  socket.on('restart', () => {
    for (const [id, player] in Object.entries(players)) {
      players[id] = {
        ...player,
        points: 0,
      };
    }

    io.emit('start_over');
  });

  // User disconnected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port);

