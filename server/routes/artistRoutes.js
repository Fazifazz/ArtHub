const express = require("express"),
  artistRouter = express.Router(),
  artistController = require("../controllers/artistController"),
  artistAuthMiddleware = require("../middlewares/Auth/artistAuth"),
  upload = require("../middlewares/imageUpload/cropImage");

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
    upload.uploadArtistPost,
    upload.resizeArtistPost,
    artistController.uploadPost
  )
  .get("/getMyPosts", artistAuthMiddleware, artistController.getMyPosts)
  .post("/deletePost", artistAuthMiddleware, artistController.deletePost)
  .post(
    "/editArtistProfile",
    artistAuthMiddleware,
    upload.uploadArtistProfile,
    upload.resizeArtistProfile,
    artistController.editArtistProfile
  )
  .post(
    "/replyUserComment",
    artistAuthMiddleware,
    artistController.replyUserComment
  )
  .post("/deleteReply", artistAuthMiddleware, artistController.deleteReply)
  .get("/successPayment/:planId", artistController.showSuccessPage)
  .get("/errorPayment", artistController.showErrorPage);

module.exports = artistRouter;
