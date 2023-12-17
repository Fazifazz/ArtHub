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
    field: {
      type: String,
      required: true,
    },
    interest: {
      type: String,
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
    payment: {
      type: String,
      required: false,
    },
    paymentHistory: [
      {
        date: Date,
        expireDate: Date,
        planName: String,
        price: Number,
        duration: String,
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    currentPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
    },
    planStatus: {
      type: String,
      default: "No plan",
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
        title: {
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
        likes: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user", // Assuming there is a User model
            },
            count: {
              type: Number,
              defualt: 0,
            },
          },
        ],
        comments: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user", // Assuming there is a User model
            },
            text: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const artistModel = mongoose.model("artist", artistSchema);

module.exports = artistModel;
