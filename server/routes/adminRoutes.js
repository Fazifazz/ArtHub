const express = require("express");
const adminRouter = express.Router();
const adminControlller = require('../controllers/adminController')

adminRouter.get('/showUsers',adminControlller.getUsers)
           .post('/blockUser',adminControlller.blockUser)


module.exports = adminRouter