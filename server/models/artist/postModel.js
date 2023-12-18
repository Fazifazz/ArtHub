const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "artist",
    },
    likes: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        postedBy: {
          type: ObjectId,
          ref: "user",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
