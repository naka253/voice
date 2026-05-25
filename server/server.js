const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

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

server.listen(3000, () => {
  console.log("Server running on port 3000");
});