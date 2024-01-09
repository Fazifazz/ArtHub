import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:5000'); // Replace with your server URL

if (socket.connected) {
  console.log("Socket is connected");
} else {
  console.log("Socket is not connected");
}

// Additional logs for debugging
socket.on("connect", () => {
  console.log("Socket connected to the server");
});

socket.on("disconnect", () => {
  console.log("Socket disconnected from the server");
});

export default socket;
