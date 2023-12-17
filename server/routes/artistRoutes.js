const express = require("express"),
  artistRouter = express.Router(),
  artistController = require("../controllers/artistController"),
  artistAuthMiddleware = require('../middlewares/artistAuth'),
  crop = require('../middlewares/imageUpload/cropImage')

artistRouter
  .post("/artistRegister", artistController.register)
  .get("/getCategories", artistController.getCategories)
  .post("/artistOtp", artistController.verifyOtp)
  .post("/artistResendOtp", artistController.ResendOtp)
  .post("/artistVerifyLogin", artistController.verifyLogin)
  .post("/artistVerifyEmail", artistController.forgetVerifyEmail)
  .post("/artistUpdatePassword", artistController.updatePassword)
  .get("/getPlansAvailable",artistAuthMiddleware, artistController.getPlansAvailable)
  .post("/subscribePlan",artistAuthMiddleware, artistController.subscribePlan)
  .post("/uploadPost",artistAuthMiddleware,crop.uploadArtistPost,crop.resizeArtistPost, artistController.uploadPost)
  .get('/getMyPosts',artistAuthMiddleware,artistController.getMyPosts)
  .post('/deletePost',artistAuthMiddleware,artistController.deletePost)
  .post('/editArtistProfile',artistAuthMiddleware,crop.uploadArtistProfile,crop.resizeArtistProfile,artistController.editArtistProfile)

module.exports = artistRouter;
