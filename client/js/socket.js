const socket = io(
  "https://voice.fly.dev"
);

const username =
localStorage.getItem("username");

const usersDiv =
document.getElementById("users");

const status =
document.getElementById(
  "connectionStatus"
);

socket.on("connect", () => {

  status.innerText = "Connected";

  socket.emit(
    "join-room",
    username
  );
});

socket.on("disconnect", () => {

  status.innerText =
    "Disconnected";
});

socket.on(
  "update-users",
  (users) => {

    usersDiv.innerHTML = "";

    users.forEach(user => {

      const div =
        document.createElement("div");

      div.className =
        "user-card";

      div.innerText =
        "🟢 " + user.username;

      usersDiv.appendChild(div);
    });
  }
);