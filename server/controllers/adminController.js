const bcrpt = require("bcrypt");
const User = require("../models/user/userModel");
const Category = require("../models/admin/categoryModel");
const Admin = require("../models/admin/adminModel");
const catchAsync = require("../util/catchAsync");

// exports.adminLogin = catchAsync(async(req,res)=>{
//   const {email,password}  = req.body;
//   const hashPassword = await bcrpt.hash(password,10)
//   const admin =  new Admin({
//     email:email,
//     password:hashPassword
//   }).save()
//   if(admin){
//     return res.status(200).json({success:'Admin Login Successfull'})
//   }
//   return res.json({error:'Admin login Failed'})
// })

exports.verifyAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email,
  });
  if (!admin) {
    return res.json({ error: "Admin not found" });
  }
  const samePassword = await bcrpt.compare(password, admin.password);
  if (!samePassword) {
    return res.json({ error: "incorrect password" });
  }
  return res.status(200).json({ success: "Admin Login Successfull" });
});

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find({ isAdmin: false });
  return res.status(200).json({ success: "ok", users });
});

exports.blockUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.body.id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isBlocked: !user.isBlocked } },
    { new: true }
  );
  if (updatedUser) {
    return res.status(200).json({ success: `${user.name} has updated` });
  } else {
    return res.json({ error: "error in updating" });
  }
});

exports.showCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    return res.status(200).json({ success: "ok", categories });
  } else {
    return res.json({ error: "error in get categories" });
  }
});

exports.addCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const newCategory = await Category.create({
    name,
    description,
  });
  if (newCategory) {
    return res
      .status(200)
      .json({ success: `${name} field added successfully` });
  } else {
    return res.json({ error: "failed to add new field" });
  }
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.body.id);
  const updatedCategory = await Category.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isDeleted: !category.isDeleted } },
    { new: true }
  );
  if (updatedCategory) {
    return res.status(200).json({ success: `${category.name} has updated` });
  } else {
    return res.json({ error: "error in updating" });
  }
});

exports.editCategory = catchAsync(async (req, res) => {
  const category = await Category.findById({ _id: req.body.id });
  if (category) {
    return res.status(200).json({ success: "ok", category });
  }
  return res.json({ error: "error" });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const { name, description, id } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: id },
    { $set: { name: name, description: description } }
  );
  if (updatedCategory) {
    return res
      .status(200)
      .json({ success: `${name} field updated successfully` });
  } else {
    return res.json({ error: "updating failed" });
  }
});
exports.updateCategory = catchAsync(async (req, res) => {
  const { name, description, id } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: id },
    { $set: { name: name, description: description } }
  );
  if (updatedCategory) {
    return res
      .status(200)
      .json({ success: `${name} field updated successfully` });
  } else {
    return res.json({ error: "updating failed" });
  }
});
