const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const subscriptionModel = new mongoose.Schema(
  {
    date:{
        type:Date,
        default:new Date(),
        required:true
    },
    expireDate:{
        type:Date,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    plan:{
        type:ObjectId,
        ref:'plan',
        required:true
    },
    artist:{
        type:ObjectId,
        ref:'artist',
        required:true
    },
  },
  {
    timestamps: true,
  }
);

const subscritionHistoryModel = mongoose.model(
  "subscription",
  subscriptionModel
);

module.exports = subscritionHistoryModel;
