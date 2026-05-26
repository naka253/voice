const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.get("/", (req, res) => {
  res.send("VC Server Running");
});

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let users = [];

io.on("connection", (socket) => {

  console.log("user connected");

  socket.on("join-room", (username) => {

    users.push({
      id: socket.id,
      username
    });

    io.emit("update-users", users);
  });

  socket.on("disconnect", () => {

    users = users.filter(user => user.id !== socket.id);

    io.emit("update-users", users);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

socket.on("ready", () => {

  const usersInRoom = users
    .filter(user => user.id !== socket.id)
    .map(user => user.id);

  socket.emit("all-users", usersInRoom);
});

socket.on("offer", ({ target, offer }) => {

  io.to(target).emit("offer", {
    sender: socket.id,
    offer
  });
});

socket.on("answer", ({ target, answer }) => {

  io.to(target).emit("answer", {
    sender: socket.id,
    answer
  });
});

socket.on("ice-candidate", ({ target, candidate }) => {

  io.to(target).emit("ice-candidate", {
    sender: socket.id,
    candidate
  });
});

let rooms = {
  Lobby: [],
  Ranked: [],
  AFK: []
};

socket.on("join-voice-room", (roomName) => {

  if (rooms[roomName].length >= 5) {
    return;
  }

  for (const room in rooms) {
    rooms[room] = rooms[room]
      .filter(id => id !== socket.id);
  }

  rooms[roomName].push(socket.id);

  io.emit("room-update", rooms);
});