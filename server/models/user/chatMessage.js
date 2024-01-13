const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const ChatMsgSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref:'user'
    },
    artistId: {
      type: ObjectId,
      ref:'artist'
    },
    room_id: {
      type: String,
    },
    senderId: {
      type: String,
    },
    message: {
      type: String,
    },
    time: {
      type: String,
    },
    isUserSeen: {
      type: Boolean,
      default:false
    },
    isArtistSeen: {
      type: Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatMsg", ChatMsgSchema);
