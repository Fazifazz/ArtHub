const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },

    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    otp: {
      type: String,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: "/images/avatar.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    ArtistYouFollow: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
