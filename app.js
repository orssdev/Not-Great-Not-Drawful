// app.js
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const path = require("path");
const Room = require("./room");
const {connect} = require("http2");

const app = express();

app.use(express.static(path.join(__dirname, "FrontEnd")));

let roomID = null;

const server = http.createServer(app);

const io = new Server(server);

const room = new Room();

const prompts = getPrompts(69);

let currentDrawings = [];
let currrentImageObject = null;
let currentGuesses = [];
let descriptionsQueue = [];
let currentVotes = [];
let votingQueue = [];
let currentScore = {};
function getPrompts(numPrompts) {
  let promptsFile = require("./prompts.json");
  let final = [];

  let numsUsed = [];
  for (let i = 0; i < numPrompts; i++) {
    let randNum = Math.floor(Math.random() * promptsFile.length);
    if (numsUsed.includes(randNum)) {
      i--;
      continue;
    }
    numsUsed.push(randNum);
    final.push(promptsFile[randNum]);
  }

  return final;
}

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
    currentScore[object.playerName] = 0;
    socket.join(roomObject.id);
    socket.emit("room-joined", roomObject);
    socket.broadcast.emit("room-joined", roomObject);
  });

  socket.on("start-game", () => {
    //let thisPrompt = prompts.pop();
    //socket.emit("start-drawing", thisPrompt);
    //socket.broadcast.emit("start-drawing", thisPrompt);
    console.log(io.sockets.sockets);
    io.sockets.sockets.forEach((socket) => {
      let thisPrompt = getPrompts(1)[0];
      socket.emit("start-drawing", thisPrompt);
      //socket.broadcast.emit("start-drawing", thisPrompt);
    });
  });


  socket.on("submit-drawing", (imageObject) => {
    currentDrawings.push(imageObject);
    let roomObject = room.getRoomFromUsername(imageObject.user);
    if (currentDrawings.length == roomObject.users) {
      descriptionsQueue = currentDrawings.slice();
      socket.emit("describe-drawing", imageObject);
      socket.broadcast.emit("describe-drawing", imageObject);
    };
  });

  socket.on("submit-description", (imageObject, guess) => {
    let roomObject = room.getRoomFromUsername(guess.user);
    currentGuesses.push(guess);
    if (currentGuesses.length == roomObject.users - 1) {
      votingQueue = currentDrawings.slice();
      for (let i = 0; i < currentDrawings.length; i++) {
        if (currentDrawings[i].user == imageObject.user) {
          currentDrawings[i].guesses = currentGuesses.slice();
          currentGuesses = [];
        }
      }
      descriptionsQueue = descriptionsQueue.filter((drawing) => drawing.user != imageObject.user);
      if (descriptionsQueue.length != 0) {
        socket.emit("describe-drawing", descriptionsQueue[0]);
        socket.broadcast.emit("describe-drawing", descriptionsQueue[0]);
      } else {
        for (let i = 0; i < currentDrawings.length; i++) {
          //console.log(currentDrawings[i]);
          for (let j = 0; j < currentDrawings[i].guesses.length; j++) {
            console.log(currentDrawings[i].guesses[j]);
          }
        }
        socket.emit("start-voting", currentDrawings);
        socket.broadcast.emit("start-voting", currentDrawings);
      }
    }
  });

  socket.on("submit-vote", (vote) => {
    let roomObject = room.getRoomFromUsername(vote.user);
    console.log(vote);
    currentVotes.push(vote);
    if (vote.trickster != "") {
      currentScore[vote.trickster] = currentScore[vote.trickster] + 1;
    } else {
      currentScore[vote.user] = currentScore[vote.user] + 1;
      currentScore[vote.artist] = currentScore[vote.artist] + 1;
    }
    if (currentVotes.length == roomObject.users - 1) {
      votingQueue = votingQueue.filter((drawing) => drawing.user != vote.artist);
      currentVotes = [];
      if (votingQueue.length != 0) {
        socket.emit("start-voting", votingQueue);
        socket.broadcast.emit("start-voting", votingQueue);
      } else {
        // show leaderboard or whatever
        socket.emit("show-leaderboard", currentScore);
        socket.broadcast.emit("show-leaderboard", currentScore);
      }
    }
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
