const express = require("express");
const adminRouter = express.Router();
const adminController = require('../controllers/adminController')

adminRouter.get('/showUsers',adminController.getUsers)
           .post('/blockUser',adminController.blockUser)
           .get('/showCategories',adminController.showCategories)
           .post('/addCategory',adminController.addCategory)
           .post('/deleteCategory',adminController.deleteCategory)
           .post('/editCategory',adminController.editCategory)
           .post('/updateCategory',adminController.updateCategory)


module.exports = adminRouter