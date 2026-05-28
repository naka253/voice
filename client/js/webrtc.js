let localStream = null;

let isMuted = false;

async function startVoice() {

  try {

    localStream =
      await navigator
      .mediaDevices
      .getUserMedia({
        audio: true
      });

    console.log(
      "Microphone connected"
    );

  } catch (error) {

    console.error(error);

    alert(
      "マイク取得失敗"
    );
  }
}

window.addEventListener(
  "load",
  async () => {

    await startVoice();

    const muteBtn =
      document.getElementById(
        "muteBtn"
      );

    muteBtn.onclick = () => {

      if (!localStream) return;

      isMuted = !isMuted;

      localStream
      .getAudioTracks()[0]
      .enabled = !isMuted;

      muteBtn.innerText =
        isMuted
        ? "Unmute"
        : "Mute";
    };
  }
);