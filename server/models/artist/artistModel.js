const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "artist",
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    ratings: [
      {
        user: { type: ObjectId, ref: "user" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],

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
      type: String,
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
      type: ObjectId,
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
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscription: {
      transactionId: {
        type: String,
      },
      currentPlan: {
        type: ObjectId,
        ref: "plan",
      },
      expiresAt: {
        type: Date,
      },
    },
    profile: {
      type: String,
      default: "avatar.png",
    },
    followers: [{ type: ObjectId, ref: "user" }],
    posts: [{ type: ObjectId, ref: "post" }],
  },
  {
    timestamps: true,
  }
);

const artistModel = mongoose.model("artist", artistSchema);

module.exports = artistModel;


