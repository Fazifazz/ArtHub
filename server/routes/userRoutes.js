const express = require("express"),
  userRouter = express.Router(),
  userController = require("../controllers/userController"),
  chatController = require("../controllers/chatController"),
  userAuth = require("../middlewares/Auth/userAuth"),
  { isUserBlocked } = require("../middlewares/blockMiddleware/isUserBlocked");
upload = require("../middlewares/imageUpload/cropImage");

userRouter
  .post("/register", userController.register)
  .post("/verifyOtp", userController.verifyOtp)
  .post("/resendOtp", userController.ResendOtp)
  .post("/verifyLogin", userController.verifyLogin)
  .post("/verifyEmail", userController.forgetVerifyEmail)
  .post("/updatePassword", userController.updatePassword)
  .get("/getAllFollowingPosts", userAuth, userController.getAllFollowingsPosts)
  .get("/getAllPosts", userAuth, userController.getAllPosts)
  .post(
    "/updateUserProfile",
    userAuth,
    upload.uploadUserProfile,
    upload.resizeUserProfile,
    userController.updateUserProfile
  )
  .post("/likePost", userAuth, userController.likePost)
  .post("/unLikePost", userAuth, userController.unLikePost)
  .post("/followArtist", userAuth, userController.followArtist)
  .post("/unFollowArtist", userAuth, userController.unFollowArtist)
  .post("/comment", userAuth, userController.comment)
  .get("/getAllArtists", userAuth, userController.getAllArtists)
  .post("/getArtistAllposts", userAuth, userController.getArtistAllposts)
  .get("/getAllBanners", userAuth, userController.getAllBanners)
  .post("/getComments", userAuth, userController.getComments)
  .get("/getCurrentUser", userAuth, userController.getCurrentUser)
  .post("/getArtistFollowers", userAuth, userController.getArtistFollowers)
  .get("/getUserFollowings", userAuth, userController.getUserFollowings)

  //chat
  .get("/getArtistsFollowed", userAuth, chatController.getArtistsUserFollow)
  .post("/getChatMessages", userAuth, chatController.getChatMessages)
  .post("/sendNewMessage", userAuth, chatController.sendNewMessage)

  //notifications
  .get(
    "/getUserAllNotifications",
    userAuth,
    userController.getUserNotifications
  )

  .delete(
    "/deleteUserNotification",
    userAuth,
    userController.deleteNotification
  )
  .delete(
    "/clearUserAllNotifications",
    userAuth,
    userController.clearAllNotification
  )
  .get(
    "/userNotificationsCount",
    userAuth,
    userController.getNotificationCount
  );

module.exports = userRouter;
