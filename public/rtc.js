(async () => {
  const socket = io();
  const video = document.getElementById("self");
  const friend = document.getElementById("friend");
  const start = document.getElementById("start");
  const fired = document.getElementById("fired");
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const peerConnection = new RTCPeerConnection(configuration);
  const remoteStream = new MediaStream();


  // Data channel memungkinkan kita untuk mengirim sembarang data ke koneksi peer
  const channel = peerConnection.createDataChannel('fael');
  channel.onopen = (event) => {
    console.log("channel success open");
    channel.send("hello world")
  }
  start.onclick = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    video.srcObject = localStream;
    friend.srcObject = remoteStream;
  };

  fired.onclick = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  socket.on("offer", async (message) => {
    const remoteDesc = new RTCSessionDescription(message);
    await peerConnection.setRemoteDescription(remoteDesc);
  });

  peerConnection.addEventListener("icecandidate", (event) => {
    if (event.candidate) socket.emit("new", event.candidate);
  });

  // Listen for remote ICE candidates and add them to the local RTCPeerConnection
  socket.on("new", async (message) => {
    if (message) {
      try {
        await peerConnection.addIceCandidate(message);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    }
  });

  // Tampilkan
  // Show screen
  peerConnection.addEventListener("track", async (event) => {
    remoteStream.addTrack(event.track, remoteStream);
  });

  // saat sudah sukses
  peerConnection.addEventListener("connectionstatechange", (event) => {
    if (peerConnection.connectionState === "connected") {
      console.log("success");
    }
  });
})();
