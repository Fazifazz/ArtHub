const express = require("express"),
  userRouter = express.Router(),
  userController = require("../controllers/userController"),
  userAuth = require('../middlewares/userAuth')
  upload = require('../middlewares/imageUpload/cropImage');

userRouter
  .post("/register", userController.register)
  .post("/verifyOtp", userController.verifyOtp)
  .post("/resendOtp", userController.ResendOtp)
  .post("/verifyLogin", userController.verifyLogin)
  .post("/verifyEmail", userController.forgetVerifyEmail)
  .post("/updatePassword", userController.updatePassword)
  .get("/getAllPosts", userController.getAllPosts)
  .post("/updateUserProfile",userAuth,upload.uploadUserProfile,upload.resizeUserProfile, userController.updateUserProfile)
  .post("/likePost",userAuth, userController.likePost)
  .post("/unLikePost",userAuth, userController.unLikePost)
  .post("/comment",userAuth, userController.comment)

module.exports = userRouter;
