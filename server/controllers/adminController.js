require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const User = require("../models/user/userModel");
const Category = require("../models/admin/categoryModel");
const Admin = require("../models/admin/adminModel");
const Plan = require("../models/admin/planModel");
const Banner = require("../models/admin/BannerModel");
const Artist = require("../models/artist/artistModel");
const catchAsync = require("../util/catchAsync");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
});

exports.verifyAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email,
  });
  if (!admin) {
    return res.json({ error: "Admin not found" });
  }
  const samePassword = await bcrypt.compare(password, admin.password);
  if (!samePassword) {
    return res.json({ error: "incorrect password" });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res
    .status(200)
    .json({ success: "Admin Login Successfull", token, admin });
});

exports.getUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await User.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize).sort({createdAt:-1});

  return res.status(200).json({
    success: "ok",
    users,
    currentPage: page,
    totalPages,
  });
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const totalCategories = await Category.countDocuments();
  const totalPages = Math.ceil(totalCategories / pageSize);

  const categories = await Category.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize).sort({createdAt:-1});
  if (categories) {
    return res.status(200).json({
      success: "ok",
      categories,
      currentPage: page,
      totalPages,
    });
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const totalPlans = await Plan.countDocuments();
  const totalPages = Math.ceil(totalPlans / pageSize);

  const plans = await Plan.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize).sort({createdAt:-1});
  if (plans) {
    return res.status(200).json({
      success: "ok",
      plans,
      currentPage: page,
      totalPages,
    });
  }
});

exports.addPlan = catchAsync(async (req, res) => {
  const { name, type, description, amount } = req.body;
  let dayDuaration;
  if (name === "weekly") {
    dayDuaration = type * 7;
  }
  if (name === "monthly") {
    dayDuaration = type * 28;
  }
  if (name === "yearly") {
    dayDuaration = type * 365;
  }

  const sameDayDuaration = await Plan.findOne({ dayDuaration: dayDuaration });
  if (sameDayDuaration) {
    return res.json({ error: "plan already exists" });
  }

  const newPlan = await Plan.create({
    name,
    type,
    description,
    amount,
    dayDuaration: dayDuaration,
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

exports.updatePlan = catchAsync(async (req, res) => {
  const { name, type, amount, description, id } = req.body;
  const plan = await Plan.findById(id);
  let dayDuaration;
  if (name === "weekly") {
    dayDuaration = type * 7;
  }
  if (name === "monthly") {
    dayDuaration = type * 28;
  }
  if (name === "yearly") {
    dayDuaration = type * 365;
  }
  const duplicatePlans = await Plan.find({
    $and: [
      { dayDuaration: dayDuaration },
      { dayDuaration: { $ne: plan.dayDuaration } },
    ],
  });

  if (duplicatePlans.length) {
    return res.json({ error: "plan already exists" });
  }
  const updatedPlan = await Plan.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        type: type,
        amount: amount,
        description: description,
        dayDuaration,
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
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const totalArtists = await Artist.countDocuments();
  const totalPages = Math.ceil(totalArtists / pageSize);

  const artists = await Artist.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize).sort({createdAt:-1});

  return res.status(200).json({
    success: "ok",
    artists,
    currentPage: page,
    totalPages,
  });
});

exports.approveArtist = catchAsync(async (req, res) => {
  const { id } = req.body;
  const artist = await Artist.findOne({ _id: id });
  if (artist) {
    artist.isApproved = true;
    await artist.save();
    return res.status(200).json({ success: `${artist.name} has approved` });
  }
  return res.json({ error: "Approval failed" });
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

exports.getSubscriptionHistory = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2; 
  const skip = (page - 1) * pageSize;

  const artists = await Artist.aggregate([
    {
      $project: {
        name: 1,
        email: 1,
        mobile: 1,
        profile: 1,
        paymentHistory: 1,
      },
    },
    {
      $unwind: {
        path: "$paymentHistory",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        paymentHistory: { $exists: true },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: pageSize,
    },
  ]);

  const totalArtists = await Artist.countDocuments({
    'paymentHistory': { $exists: true },
  });

  res.status(200).json({
    success: "ok",
    payments: artists,
    currentPage: page,
    totalPages: Math.ceil(totalArtists / pageSize),
  });
});

//banners

exports.addBanner = catchAsync(async (req, res) => {
  const { title, description, bannerImage } = req.body;
  const newBanner = await Banner.create({
    title,
    description,
    image: bannerImage,
  });
  if (newBanner) {
    return res
      .status(200)
      .json({ success: `${title} banner added successfully` });
  }
  return res.status(200).json({ error: "failed in adding banner" });
});

exports.showBanners = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 2;
  const totalBanners = await Banner.countDocuments();
  const totalPages = Math.ceil(totalBanners / pageSize);

  const banners = await Banner.find({})
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  if (banners) {
    return res.status(200).json({
      success: "ok",
      banners,
      currentPage: page,
      totalPages,
    });
  }
});

exports.deleteBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findById(req.body.id);
  const updatedBanner = await Banner.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { isDeleted: !banner.isDeleted } },
    { new: true }
  );
  if (updatedBanner.isDeleted) {
    return res
      .status(200)
      .json({ success: `${banner.title} banner has unlisted` });
  }
  if (!updatedBanner.isDeleted) {
    return res
      .status(200)
      .json({ success: `${banner.title} banner has listed` });
  }
  return res.json({ error: "error in updating" });
});

exports.updateBanner = catchAsync(async (req, res) => {
  const { title, description, bannerImage, bannerId } = req.body;
  const updatedBanner = await Banner.findByIdAndUpdate(bannerId, {
    $set: {
      title,
      description,
      image: bannerImage,
    },
  });
  if (updatedBanner) {
    return res
      .status(200)
      .json({ success: `${title} banner updated successfully` });
  }
  return res.status(200).json({ error: "failed in updating banner" });
});
