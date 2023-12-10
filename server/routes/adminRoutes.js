const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/adminController");

adminRouter
  .post("/postAdminLogin", adminController.verifyAdmin)
  .get("/showUsers", adminController.getUsers)
  .post("/blockUser", adminController.blockUser)

//   category
  .get("/showCategories", adminController.showCategories)
  .post("/addCategory", adminController.addCategory)
  .post("/deleteCategory", adminController.deleteCategory)
  .post("/editCategory", adminController.editCategory)
  .post("/updateCategory", adminController.updateCategory)

//plans
  .get("/showPlans", adminController.showPlans)
  .post("/postAddPlan", adminController.addPlan)
  .post("/deletePlan", adminController.deletePlan)
  .post("/editPlan", adminController.editPlan)
  .post("/updatePlan", adminController.updatePlan)

//arists
  .get('/showArtists',adminController.showArtists)  
  .post('/blockArtist',adminController.blockArtist)  


module.exports = adminRouter;
