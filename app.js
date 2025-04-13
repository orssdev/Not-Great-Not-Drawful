// app.js
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const path = require("path");
const Room = require("./room");

const app = express();

app.use(express.static(path.join(__dirname, "FrontEnd")));

let roomID = null;

const server = http.createServer(app);

const io = new Server(server);

const room = new Room();

io.on("connection", async (socket) => {
  socket.on("create-room", async () => {
    roomObject = await room.createRoom();
    socket.join(roomObject.id);
    socket.emit("room-created", roomObject);
  });

  // object is in format
  // {
  //    playerName: "player1",
  //    joinCode: "joinCode"
  // }
  socket.on("join-room", async (object) => {
    roomObject = await room.joinFromJoinCode(object);
    socket.join(roomObject.id);
    socket.emit("room-joined", roomObject);
    socket.broadcast.emit("room-joined", roomObject);
  });

  socket.on("send-message", (message) => {
    socket.to(roomID).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    // leave roomA
    console.log(socket.sids);
    room.leaveRoom(roomID);
  });
});

server.on("error", (err) => {
  console.log("Error opening server");
});

server.listen(8001, () => {
  console.log("Server working on port 8001");
});
