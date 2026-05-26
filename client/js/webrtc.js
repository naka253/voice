const peerConnections = {};

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
};

let localStream;

async function startVoice() {

  localStream = await navigator.mediaDevices.getUserMedia({
    audio: true
  });

  socket.emit("ready");
}

async function createPeerConnection(userId) {

  const peer = new RTCPeerConnection(configuration);

  peerConnections[userId] = peer;

  localStream.getTracks().forEach(track => {
    peer.addTrack(track, localStream);
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", {
        target: userId,
        candidate: event.candidate
      });
    }
  };

  peer.ontrack = (event) => {

    const audio = document.createElement("audio");

    audio.srcObject = event.streams[0];

    audio.autoplay = true;

    document.body.appendChild(audio);
  };

  return peer;
}

let isMuted = false;

document.getElementById("muteBtn")
.onclick = () => {

  isMuted = !isMuted;

  localStream.getAudioTracks()[0].enabled = !isMuted;

  document.getElementById("muteBtn")
  .innerText = isMuted ? "Unmute" : "Mute";
};

function detectSpeaking(stream, element) {

  const audioContext = new AudioContext();

  const analyser = audioContext.createAnalyser();

  const microphone =
    audioContext.createMediaStreamSource(stream);

  microphone.connect(analyser);

  analyser.fftSize = 256;

  const dataArray =
    new Uint8Array(analyser.frequencyBinCount);

  function checkVolume() {

    analyser.getByteFrequencyData(dataArray);

    const volume =
      dataArray.reduce((a, b) => a + b) /
      dataArray.length;

    if (volume > 20) {
      element.classList.add("user-speaking");
    } else {
      element.classList.remove("user-speaking");
    }

    requestAnimationFrame(checkVolume);
  }

  checkVolume();
}