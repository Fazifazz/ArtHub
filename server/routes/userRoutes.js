const express = require("express"),
  userRouter = express.Router(),
  userController = require("../controllers/userController"),
  userAuth = require('../middlewares/Auth/userAuth'),
  isBlocked = require('../middlewares/blockMiddleware/isUserBlocked')
  upload = require('../middlewares/imageUpload/cropImage');

userRouter
  .post("/register", userController.register)
  .post("/verifyOtp", userController.verifyOtp)
  .post("/resendOtp", userController.ResendOtp)
  .post("/verifyLogin", userController.verifyLogin)
  .post("/verifyEmail", userController.forgetVerifyEmail)
  .post("/updatePassword", userController.updatePassword)
  .get("/getAllPosts",userAuth,isBlocked.isUserBlocked, userController.getAllPosts)
  .post("/updateUserProfile",userAuth,upload.uploadUserProfile,upload.resizeUserProfile, userController.updateUserProfile)
  .post("/likePost",userAuth, userController.likePost)
  .post("/unLikePost",userAuth, userController.unLikePost)
  .post("/followArtist",userAuth, userController.followArtist)
  .post("/unFollowArtist",userAuth, userController.unFollowArtist)
  .post("/comment",userAuth, userController.comment)
  .get('/getAllArtists',userAuth,userController.getAllArtists)
  .post('/getArtistAllposts',userAuth,userController.getArtistAllposts)
  .get('/getAllBanners',userAuth,userController.getAllBanners)

module.exports = userRouter;
