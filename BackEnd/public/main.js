// main.js
const messageBox = document.querySelector("#messages");
const textBox = document.querySelector("input");
const sendButton = document.querySelector("button");

function createMessage(text, ownMessage = false) {
  const messageElement = document.createElement("div");
  messageElement.className = "chat-message";
  const subMesssageElement = document.createElement("div");
  subMesssageElement.className =
    "px-4 py-4 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600";
  if (ownMessage) {
    subMesssageElement.className += " float-right bg-blue-800 text-white";
  }
  subMesssageElement.innerText = text;
  messageElement.appendChild(subMesssageElement);

  messageBox.appendChild(messageElement);
}

function endpointString() {
  return window.location.href.split("/").filter((e) => e.length != 0).pop();
}

const endpoint = endpointString();
console.log(endpoint);

//let socket = endpoint.length === 0 ? io() : io(endpoint);
let socket = io();
//let toRoom = socket.to(endpoint);

socket.on("connect", () => {
  console.log(socket.id);
  console.log(endpoint);
  if (endpoint.length === 4) {
    let data = { message: endpoint };
    socket.emit("join-room", data);
  } else if (endpoint === "createRoom") {
    socket.emit("create-room");
  }
});

//socket.on("room-created", (roomId) => {
//  this.roomId = roomId;
//});

socket.on("receive-message", (message) => {
  createMessage(message);
});

sendButton.addEventListener("click", () => {
  if (textBox.value != "") {
    socket.emit("send-message", textBox.value);
    createMessage(textBox.value, true);
    textBox.value = "";
  }
});
