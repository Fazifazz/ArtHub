const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/adminController");
const adminAuthMiddleware = require("../middlewares/Auth/adminAuth");
const uploadBanner = require("../middlewares/imageUpload/cropImage");

adminRouter
  .post("/postAdminLogin", adminController.verifyAdmin)
  .get("/showUsers", adminAuthMiddleware, adminController.getUsers)
  .post("/blockUser", adminAuthMiddleware, adminController.blockUser)

  //   category
  .get("/showCategories", adminAuthMiddleware, adminController.showCategories)
  .post("/addCategory", adminAuthMiddleware, adminController.addCategory)
  .post("/deleteCategory", adminAuthMiddleware, adminController.deleteCategory)
  .post("/updateCategory", adminAuthMiddleware, adminController.updateCategory)

  //plans
  .get("/showPlans", adminAuthMiddleware, adminController.showPlans)
  .post("/postAddPlan", adminAuthMiddleware, adminController.addPlan)
  .post("/deletePlan", adminAuthMiddleware, adminController.deletePlan)
  .post("/updatePlan", adminAuthMiddleware, adminController.updatePlan)

  //arists
  .get("/showArtists", adminAuthMiddleware, adminController.showArtists)
  .post("/approveArtist", adminAuthMiddleware, adminController.approveArtist)
  .post("/blockArtist", adminAuthMiddleware, adminController.blockArtist)

  //banners
  .get("/showBanners", adminAuthMiddleware, adminController.showBanners)
  .post(
    "/addBanner",
    adminAuthMiddleware,
    uploadBanner.uploadBannerImage,
    uploadBanner.resizeBannerImage,
    adminController.addBanner
  )
  .post("/deleteBanner", adminAuthMiddleware, adminController.deleteBanner)
  .post(
    "/updateBanner",
    adminAuthMiddleware,
    uploadBanner.uploadBannerImage,
    uploadBanner.resizeBannerImage,
    adminController.updateBanner
  )

  //subscription history
  .get(
    "/getSubscriptionHistory",
    adminAuthMiddleware,
    adminController.getSubscriptionHistory
  )
  .get(
    "/getDashboardDatas",
    adminAuthMiddleware,
    adminController.getDashboardDatas
  )

module.exports = adminRouter;
