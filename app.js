import http from "http";
import websocket from "websocket";

const port = 8000;
const WebSocketServer = websocket.server;

// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(port);

const wsServer = new WebSocketServer({
  httpServer: server,
});

const clients = {};

// This code generates unique userid for everyuser.
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
  var userID = getUniqueID();
  console.log(`Recieved a new connection from origin ${request.origin}`);

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;

  console.log(`connected: ${userID}`);
});