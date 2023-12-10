const bcrpt = require("bcrypt");
const jwt =  require('jsonwebtoken')
const User = require("../models/user/userModel");
const Category = require("../models/admin/categoryModel");
const Admin = require("../models/admin/adminModel");
const Plan = require("../models/admin/planModel");
const Artist = require("../models/artist/artistModel");
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
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({ success: "Admin Login Successfull",token,admin });
});

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find({});
  return res.status(200).json({ success: "ok", users });
});

exports.blockUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.body.id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isBlocked: !user.isBlocked } },
    { new: true }
  );
  if (updatedUser.isBlocked) {
    return res.status(200).json({ success: `${user.name} has blocked` });
  }
  if (!updatedUser.isBlocked) {
    return res.status(200).json({ success: `${user.name} has unblocked` });
  }
  return res.json({ error: "error in updating" });
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
  const category = await Category.findById(id);
  const duplicateCategories = await Category.find({
    name: { $ne: category.name, $regex: new RegExp("^" + name + "$", "i") },
  });

  if (duplicateCategories.length) {
    return res.json({ error: "category name already exists" });
  }
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

//plans

exports.showPlans = catchAsync(async (req, res) => {
  const plans = await Plan.find({});
  if (plans) {
    res.status(200).json({ success: "ok", plans });
  }
});

exports.addPlan = catchAsync(async (req, res) => {
  const { name, type, description, amount } = req.body;
  const sameName = await Plan.findOne({ name: new RegExp(name, "i") });
  if (sameName) {
    return res.json({ error: "plan name already exists" });
  }
  const newPlan = await Plan.create({
    name,
    type,
    description,
    amount,
  });
  if (newPlan) {
    return res.status(200).json({ success: `plan added successfully` });
  } else {
    return res.json({ error: "failed to add new plan" });
  }
});

exports.deletePlan = catchAsync(async (req, res) => {
  const plan = await Plan.findById(req.body.id);
  const updatedPlan = await Plan.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isDeleted: !plan.isDeleted } },
    { new: true }
  );
  if (updatedPlan.isDeleted) {
    return res.status(200).json({ success: `${plan.name} has unlisted` });
  }
  if (!updatedPlan.isDeleted) {
    return res.status(200).json({ success: `${plan.name} has listed` });
  }
  return res.json({ error: "error in updating" });
});

exports.editPlan = catchAsync(async (req, res) => {
  const plan = await Plan.findById({ _id: req.body.id });
  if (plan) {
    return res.status(200).json({ success: "ok", plan });
  }
  return res.json({ error: "error" });
});

exports.updatePlan = catchAsync(async (req, res) => {
  const { name, type, amount, description, id } = req.body;
  const plan = await Plan.findById(id);
  const duplicatePlans = await Plan.find({
    name: { $ne: plan.name, $regex: new RegExp("^" + name + "$", "i") },
  });

  if (duplicatePlans.length) {
    return res.json({ error: "plan name already exists" });
  }
  const updatedPlan = await Plan.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        type: type,
        amount: amount,
        description: description,
      },
    }
  );
  if (updatedPlan) {
    return res
      .status(200)
      .json({ success: `${name} plan updated successfully` });
  } else {
    return res.json({ error: "updating failed" });
  }
});

//Artists

exports.showArtists = catchAsync(async (req, res) => {
  const artists = await Artist.find({isVerified:true});
  return res.status(200).json({ success: "ok", artists });
});

exports.blockArtist = catchAsync(async (req, res) => {
  const artist = await Artist.findById(req.body.id);
  const updatedArtist = await Artist.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isBlocked: !artist.isBlocked } },
    { new: true }
  );
  if (updatedArtist.isBlocked) {
    return res.status(200).json({ success: `${artist.name} has blocked` });
  }
  if (!updatedArtist.isBlocked) {
    return res.status(200).json({ success: `${artist.name} has unblocked` });
  }
  return res.json({ error: "error in updating" });
});
