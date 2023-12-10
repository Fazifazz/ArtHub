const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    worksDone: {
      type: Number,
      required: true,
    },
    YearOfExperience: {
      type: Number,
    },
    otp: {
      code: {
        type: String,
      },
      generatedAt: {
        type: Date,
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    interest: {
      type: String,
      required: true,
    },
    educationalQualifications: {
      type: String,
    },
    communicationLangauge: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    planStatus:{
      type:String,
      default:'No plan'
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: "avatar.png",
    },
    Followers: {
      type: Array,
    },
    posts: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const artistModel = mongoose.model("artist", artistSchema);

module.exports = artistModel;
