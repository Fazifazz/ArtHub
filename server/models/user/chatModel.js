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
