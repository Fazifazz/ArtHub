const express = require("express");
const artistRouter = express.Router();

const artistController = require("../controllers/artistController");

artistRouter
  .post("/artistRegister", artistController.register)
  .get("/getCategories", artistController.getCategories)
  .post("/artistOtp", artistController.verifyOtp)
  .post("/artistResendOtp", artistController.ResendOtp)
  .post("/artistVerifyLogin", artistController.verifyLogin);

module.exports = artistRouter;
