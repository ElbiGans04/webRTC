// const socket = io('http://localhost:3000');
// const configuration = {
//     'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
// }
// const peerConnection = new RTCPeerConnection(configuration);

// socket.on('offer', async (message) => {
//     peerConnection.setRemoteDescription(new RTCSessionDescription(message));
//     const answer = await peerConnection.createAnswer();
//     peerConnection.setLocalDescription(answer)
//     socket.emit('offer', answer);
// })

// socket.on('new', async message => {
//     if (message) {
//         try {
//             await peerConnection.addIceCandidate(message);
//         } catch (e) {
//             console.error('Error adding received ice candidate', e);
//         }
//     }
// })

// // saat sudah sukses
// peerConnection.addEventListener('connectionstatechange', event => {
//     if (peerConnection.connectionState === 'connected') {
//        console.log("Connect")
//     }
// });

//   // Tampilkan
//   // Show screen
//   const remoteStream = new MediaStream();
//   friend.srcObject = remoteStream;

//   peerConnection.addEventListener("track", async (event) => {
//     remoteStream.addTrack(event.track, remoteStream);
//   });

(async () => {
  const socket = io("http://localhost:3000");
  const video = document.getElementById("self");
  const friend = document.getElementById("friend");
  const start = document.getElementById("start");
  const fired = document.getElementById("fired");
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const peerConnection = new RTCPeerConnection(configuration);
  const remoteStream = new MediaStream();

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
    peerConnection.setRemoteDescription(new RTCSessionDescription(message));
    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);
    socket.emit("offer", answer);
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
