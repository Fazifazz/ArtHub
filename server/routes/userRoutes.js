const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");

userRouter.post("/register", userController.register)
          .post("/verifyOtp", userController.verifyOtp)
          .post("/resendOtp",userController.ResendOtp)
          .post("/verifyLogin", userController.verifyLogin)
          .post("/verifyEmail", userController.forgetVerifyEmail)
          .post("/updatePassword", userController.updatePassword)

module.exports = userRouter;
