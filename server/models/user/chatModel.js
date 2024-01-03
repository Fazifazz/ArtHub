const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const ChatConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
    },
    artistId: {
      type: ObjectId,
      ref: "artist",
    },
    artistImage: {
      type: String,
    },
    artistName: {
      type: String,
    },
    userName: {
      type: String,
    },
    userImage: {
      type: String,
    },
    latestMsg: {
      type: ObjectId,
      ref:'chatMsg'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatConnection", ChatConnectionSchema);
