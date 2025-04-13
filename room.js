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
        users: 0,
        userNames: [],
        joinCode: joinCode,
      });
      console.log(this.roomsState);
      return resolve({id: newID, joinCode: joinCode});
    });
  }

  getRoomFromJoinCode(joinCode) {
    for (let i = 0; i < this.roomsState.length; i++) {
      if (this.roomsState[i].joinCode === joinCode) {
        return this.roomsState[i];
      }
    }
  }

  getRoomFromUsername(username) {
    for (let i = 0; i < this.roomsState.length; i++) {
      if (this.roomsState[i].userNames.includes(username)) {
        return this.roomsState[i];
      }
    }
  }

  // object in format:
  // {
  //   username: str
  //   joinCode: str
  // }
  joinFromJoinCode(object) {
    return new Promise((resolve) => {
    let joinCode = object.joinCode.toLowerCase();
      for (let i = 0; i < this.roomsState.length; i++) {
        if (this.roomsState[i].joinCode === joinCode) {
          console.log("JOIN CODE FOUND");
          this.roomsState[i].users++;
          this.roomsState[i].userNames.push(object.playerName);
          console.log(this.roomsState[i]);
          return resolve(this.roomsState[i]);
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
