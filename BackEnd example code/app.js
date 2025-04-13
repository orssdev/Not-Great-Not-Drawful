// app.js
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const path = require("path");
const Room = require("./room");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/createRoom", express.static(path.join(__dirname, "public")));
app.use("/joinRoom/:roomID", express.static(path.join(__dirname, "public")));

let roomID = null;

const server = http.createServer(app);

const io = new Server(server);

const room = new Room();

io.on("connection", async (socket) => {
  socket.on("create-room", async () => {
    roomID = await room.createRoom();
    socket.join(roomID);
    socket.emit("room-created", roomID);
  });

  socket.on("join-room", async (data) => {
    roomID = await room.joinFromJoinCode(data.message);
    socket.join(roomID);
    socket.emit("room-joined", roomID);
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
