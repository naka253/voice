const socket = io("https://voice-production-bee7.up.railway.app");

const username = localStorage.getItem("username");

socket.emit("join-room", username);

const usersDiv = document.getElementById("users");

socket.on("update-users", (users) => {

  usersDiv.innerHTML = "";

  users.forEach(user => {

    const div = document.createElement("div");

    div.className = "user-card";

    div.innerHTML = `🟢 ${user.username}`;

    usersDiv.appendChild(div);
  });
});