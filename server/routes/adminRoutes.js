const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/adminController");
const adminAuthMiddleware = require("../middlewares/Auth/adminAuth");

adminRouter
  .post("/postAdminLogin", adminController.verifyAdmin)
  .get("/showUsers", adminAuthMiddleware, adminController.getUsers)
  .post("/blockUser",adminAuthMiddleware, adminController.blockUser)

  //   category
  .get("/showCategories", adminAuthMiddleware, adminController.showCategories)
  .post("/addCategory", adminAuthMiddleware, adminController.addCategory)
  .post("/deleteCategory", adminAuthMiddleware, adminController.deleteCategory)
  .post("/editCategory", adminAuthMiddleware, adminController.editCategory)
  .post("/updateCategory", adminAuthMiddleware, adminController.updateCategory)

  //plans
  .get("/showPlans", adminAuthMiddleware, adminController.showPlans)
  .post("/postAddPlan", adminAuthMiddleware, adminController.addPlan)
  .post("/deletePlan", adminAuthMiddleware, adminController.deletePlan)
  .post("/editPlan", adminAuthMiddleware, adminController.editPlan)
  .post("/updatePlan", adminAuthMiddleware, adminController.updatePlan)

  //arists
  .get("/showArtists", adminAuthMiddleware, adminController.showArtists)
  .post('/approveArtist',adminAuthMiddleware,adminController.approveArtist)
  .post("/blockArtist", adminAuthMiddleware, adminController.blockArtist);

module.exports = adminRouter;
