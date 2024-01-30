const express = require("express"),
  artistRouter = express.Router(),
  artistController = require("../controllers/artistController"),
  chatController = require("../controllers/chatController"),
  artistAuthMiddleware = require("../middlewares/Auth/artistAuth"),
  upload = require("../middlewares/imageUpload/cropImage"),
  PlanExpired = require("../middlewares/artistPlanExpiryCheck");

artistRouter
  .post("/artistRegister", artistController.register)
  .get("/getCategories", artistController.getCategories)
  .post("/artistOtp", artistController.verifyOtp)
  .post("/artistResendOtp", artistController.ResendOtp)
  .post("/artistVerifyLogin", artistController.verifyLogin)
  .post("/artistVerifyEmail", artistController.forgetVerifyEmail)
  .post("/artistUpdatePassword", artistController.updatePassword)
  .get(
    "/getPlansAvailable",
    artistAuthMiddleware,
    artistController.getPlansAvailable
  )
  .post(
    "/subscribePlan",
    artistAuthMiddleware,
    artistController.subscriptionPayment
  )
  .post(
    "/uploadPost",
    artistAuthMiddleware,
    PlanExpired.isPlanExpired,
    upload.uploadArtistPost,
    upload.resizeArtistPost,
    artistController.uploadPost
  )
  .get("/getMyPosts", artistAuthMiddleware, artistController.getMyPosts)
  .post(
    "/deletePost",
    artistAuthMiddleware,
    PlanExpired.isPlanExpired,
    artistController.deletePost
  )
  .post(
    "/editArtistProfile",
    artistAuthMiddleware,
    upload.uploadArtistProfile,
    upload.resizeArtistProfile,
    artistController.editArtistProfile
  )
  .post(
    "/getPostComments",
    artistAuthMiddleware,
    artistController.getPostComments
  )
  .post(
    "/replyUserComment",
    artistAuthMiddleware,
    artistController.replyUserComment
  )
  .post("/deleteReply", artistAuthMiddleware, artistController.deleteReply)
  .get(
    "/successPayment",
    artistController.showSuccessPage
  )
  .get("/errorPayment", artistController.showErrorPage)

  //chat
  .get(
    "/getAllMessagedUsers",
    artistAuthMiddleware,
    chatController.getUserChatList
  )
  .post(
    "/getPrevMessages",
    artistAuthMiddleware,
    chatController.artistGetRoom
  )
  .post(
    "/sendArtistNewMsg",
    artistAuthMiddleware,
    chatController.artistNewMessage
  )


  //notifications
  .get(
    "/getArtistNotifications",
    artistAuthMiddleware,
    artistController.getArtistNotifications
  )

  .delete(
    "/deleteNotification",
    artistAuthMiddleware,
    artistController.deleteNotification
  )
  .delete(
    "/clearArtistAllNotifications",
    artistAuthMiddleware,
    artistController.clearAllNotification
  )
  .get(
    "/getArtistNotificationCount",
    artistAuthMiddleware,
    artistController.getNotificationCount
  )
  .get(
    "/getMySubscriptions",
    artistAuthMiddleware,
    artistController.getMySubscriptions
  )
  .get(
    "/getArtistBanners",
    artistAuthMiddleware,
    artistController.getArtistBanners
  )
  .get(
    "/getRatedUsers",
    artistAuthMiddleware,
    artistController.getRatedUsers
  )
  .get(
    "/checkArtistBlocked",
    artistAuthMiddleware,
    artistController.checkCurrentArtistBlocked
  )
  .get(
    "/getFollowersInArtistSide",
    artistAuthMiddleware,
    artistController.getArtistFollowers
  )

module.exports = artistRouter;
