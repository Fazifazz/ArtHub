const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const NotificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: String, 
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    relatedPostId: {
      type: ObjectId,
      ref: "post",
    },
    notificationMessage: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("notification", NotificationSchema);
module.exports = NotificationModel;
