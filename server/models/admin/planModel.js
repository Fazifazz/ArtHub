const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    description: { 
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    dayDuaration:{
      type:Number,
      required:true
    },
  },
  {
    timestamps: true,
  }
);

const planModel = mongoose.model("plan", planSchema);

module.exports = planModel;
