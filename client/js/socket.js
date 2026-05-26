const socket = io("https://voice-production-bee7.up.railway.app", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000
});

const username = localStorage.getItem("username");

socket.emit("join-room", username);

startVoice();

socket.on("all-users", async (users) => {

  for (const userId of users) {

    const peer = await createPeerConnection(userId);

    const offer = await peer.createOffer();

    await peer.setLocalDescription(offer);

    socket.emit("offer", {
      target: userId,
      offer
    });
  }
});

socket.on("offer", async ({ sender, offer }) => {

  const peer = await createPeerConnection(sender);

  await peer.setRemoteDescription(
    new RTCSessionDescription(offer)
  );

  const answer = await peer.createAnswer();

  await peer.setLocalDescription(answer);

  socket.emit("answer", {
    target: sender,
    answer
  });
});

socket.on("answer", async ({ sender, answer }) => {

  const peer = peerConnections[sender];

  await peer.setRemoteDescription(
    new RTCSessionDescription(answer)
  );
});

socket.on("ice-candidate", async ({ sender, candidate }) => {

  const peer = peerConnections[sender];

  if (peer) {
    await peer.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
  }
});

function joinRoom(roomName) {

  socket.emit("join-voice-room", roomName);
}

socket.on("room-update", (rooms) => {

  console.log(rooms);
});

const status =
document.getElementById("connectionStatus");

socket.on("connect", () => {

  status.innerText = "Connected";
});

socket.on("disconnect", () => {

  status.innerText = "Disconnected";
});

socket.on("reconnect", () => {

  status.innerText = "Reconnected";
});