// room.js
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// the maximum number of people allowed in a room
const ROOM_MAX_CAPACITY = 4;

class Room {
  constructor() {
    this.roomsState = [];
  }


  createRoom(){
    return new Promise((resolve) => {
      const newID = uuidv4();
      const joinCode = crypto.randomBytes(2).toString("hex");
      this.roomsState.push({
        id: newID,
        users: 1,
        joinCode: joinCode,
      });
      console.log(this.roomsState);
      return resolve({id: newID, joinCode: joinCode});
    });
  }

  joinRoom() {
    return new Promise((resolve) => {
      for (let i = 0; i < this.roomsState.length; i++) {
        if (this.roomsState[i].users < ROOM_MAX_CAPACITY) {
          this.roomsState[i].users++;
          console.log(`room ID is ${this.roomsState[i].id}`);
          console.log(this.roomsState[i]);
          return resolve(this.roomsState[i].id);
        }
      }

      const newID = uuidv4();
      const joinCode = crypto.randomBytes(2).toString("hex");
      this.roomsState.push({
        id: newID,
        users: 1,
        joinCode: joinCode,
      });
      return resolve({id: newID, joinCode: joinCode});
    });
  }

  joinFromJoinCode(joinCode) {
    return new Promise((resolve) => {
    joinCode = joinCode.toLowerCase();
      for (let i = 0; i < this.roomsState.length; i++) {
        if (this.roomsState[i].joinCode === joinCode) {
          console.log("JOIN CODE FOUND");
          this.roomsState[i].users++;
          console.log(this.roomsState[i]);
          return resolve(this.roomsState[i].id);
        }
      }
    });
  };

  leaveRoom(id) {
    this.roomsState = this.roomsState.filter((room) => {
      if (room.id === id) {
        if (room.users === 1) {
          console.log(room)
          return false;
        } else {
          room.users--;
        }
      }
      console.log(room);
      return true;
    });
  }
}

module.exports = Room;
