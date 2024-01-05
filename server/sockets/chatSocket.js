const socketIo = require("socket.io");
const User = require("../models/user/userModel");
const Artist = require("../models/artist/artistModel");
// Require the Socket.io module
function intializeSocket(server) {
  const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("setup", (Data) => {
      // Data  -      userId
      socket.join(Data);
      socket.emit("connected");
    });

    socket.on("join", (room) => {
      socket.join(room);
    });

    socket.on("chatMessage", async (message) => {
      if (message.userId === message.senderId) {
        socket.in(message.artistId).emit("message received", message);
        const user = await User.findById(message.userId);
        // Emit a notification event to the artist
        io.to(message.artistId).emit("artistNotification", {
          message: `New message from ${user.name}`,
        });
      } else {
        socket.in(message.userId).emit("message received", message);
        const artist = await Artist.findById(message.artistId);
        // Emit a notification event to the user
        io.to(message.userId).emit("userNotification", {
          message: `New message from ${artist.name}`,
        });
      }
    });

    socket.on('allNotifications', async (notification, artistId) => {
      io.to(artistId).emit('artistNotification', {
        message: notification
      });
    });
    

    socket.on("disconnect", () => {
      // console.log('A user disconnected');
    });
  });
}
module.exports = { intializeSocket };
