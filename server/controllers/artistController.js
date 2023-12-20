require("dotenv").config();
const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  randomString = require("randomstring"),
  otpTemplate = require("../util/otpTemplate"),
  Artist = require("../models/artist/artistModel"),
  Plan = require("../models/admin/planModel"),
  Category = require("../models/admin/categoryModel"),
  Post = require("../models/artist/postModel"),
  catchAsync = require("../util/catchAsync"),
  crypto = require("crypto"),
  Razorpay = require("razorpay"),
  Mail = require("../util/otpMailer");

var razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    return res.status(200).json({ success: "ok", categories });
  }
});

exports.register = catchAsync(async (req, res) => {
  const {
    name,
    mobile,
    email,
    password,
    experience,
    worksDone,
    interest,
    qualification,
    language,
    category,
  } = req.body;
  const artistExists = await Artist.findOne({ email: email });
  if (artistExists) {
    return res.json({ error: "Artist already exists" });
  }
  //hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  const field = await Category.findById(category);
  const artist = new Artist({
    name,
    mobile,
    password: hashPassword,
    email,
    YearOfExperience: experience,
    worksDone,
    interest,
    educationalQualifications: qualification,
    communicationLangauge: language,
    category,
    field: field.name,
    otp: {
      code: newOtp,
      generatedAt: Date.now(),
    },
  });
  const newArtist = await artist.save();
  if (newArtist) {
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: "ArtHub register verification OTP",
      html: otpTemplate(newOtp),
    };
    await Mail.sendMail(options);
    return res.json({ success: "otp sented to your mail", email });
  }
});



exports.verifyOtp = catchAsync(async (req, res) => {
  const { otp, email } = req.body;
  const artist = await Artist.findOne({ email: email });
  const generatedAt = new Date(artist.otp.generatedAt).getTime();
  if (Date.now() - generatedAt <= 30 * 1000) {
    if (otp === artist.otp.code) {
      artist.isVerified = true;
      artist.otp.code = "";
      await artist.save();
      return res.status(200).json({ success: "artist registered successfully" });
    } else {
      return res.json({ error: "otp is invalid" });
    }
  } else {
    return res.json({ error: "otp expired!" });
  }
});

exports.ResendOtp = catchAsync(async (req, res) => {
  if (!req.body.email) {
    return console.log("email not found");
  }
  const artist = await Artist.findOne({ email: req.body.email });
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  const options = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "ArtHub verification otp",
    html: otpTemplate(newOtp),
  };
  await Mail.sendMail(options)
    .then((res) => console.log("otp sended"))
    .catch((err) => console.log(err.message));

  artist.otp.code = newOtp;
  artist.otp.generatedAt = Date.now();
  await artist.save();
  return res
    .status(200)
    .json({ success: "Otp Resended", email: req.body.email });
});

exports.verifyLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const artist = await Artist.findOne({ email: email });
  if (!artist) {
    return res.json({ error: "Artist not found" });
  }
  const samePass = await bcrypt.compare(password, artist.password);
  if (!samePass) {
    return res.json({ error: "invalid password" });
  }
  if (artist.isBlocked) {
    return res.json({ error: "sorry,you are blocked by the Admin!" });
  }
  if (!artist.isApproved) {
    return res.json({ error: "wait for the Approval by the Admin!" });
  }
  if (!artist.isVerified) {
    await Artist.findOneAndDelete({ email: email });
    return res.json({ error: "sorry,you are not verified!, sign up again" });
  }
  const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return res.status(200).json({ success: "Login Successfull", token, artist });
});

exports.forgetVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const artist = await Artist.findOne({ email: email });
  console.log(artist);
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  if (artist) {
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: "ArtHub Email verification OTP for forget password",
      html: otpTemplate(newOtp),
    };
    await Mail.sendMail(options);
    await Artist.findOneAndUpdate(
      { email: email },
      { $set: { otp: { code: newOtp } } },
      { new: true }
    );
    return res.status(200).json({ success: "otp sended to your Email", email });
  }
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const artist = await Artist.findOne({ email: email });
  const hashPassword = await bcrypt.hash(password, 10);
  if (artist) {
    artist.password = hashPassword;
    await artist.save();
    return res.status(200).json({ success: "password changed successfully" });
  }
  return res.status(200).json({ error: "password changing failed" });
});

exports.getPlansAvailable = catchAsync(async (req, res) => {
  const plans = await Plan.find({ isDeleted: false });
  if (plans) {
    return res.status(200).json({ success: "ok", plans });
  }
});

exports.subscribePlan = catchAsync(async (req, res) => {
  const { id } = req.body;
  const artistId = req.artistId;
  const artist = await Artist.findById(artistId);
  const plan = await Plan.findById(id);

  if (!plan) {
    return res.status(200).json({ error: "plan not found" });
  }
  const planPrice = plan.amount * 100;
  const options = {
    amount: planPrice, // Amount in paise
    currency: "INR",
    receipt: crypto.randomBytes(4).toString("hex"),
  };

  const order = await razorpay.orders.create(options);
  return res
    .status(200)
    .json({ success: "ok", order, key_id: process.env.KEY_ID, artist });
});

exports.uploadPost = catchAsync(async (req, res) => {
  const { title, description, artistPost } = req.body;
  const artistId = req.artistId;
  const newPost = await Post.create({
    title,
    description,
    postedBy:artistId,
    image:artistPost
  })
   
  const updatedArtist = await Artist.findByIdAndUpdate(
    { _id: artistId },
    { $push: { posts: newPost._id } },
    { new: true }
  );

  if (updatedArtist) {
    return res.status(200).json({ success: "New post added successfully" });
  }
  return res.status(200).json({ error: "post adding failed" });
});

exports.getMyPosts = catchAsync(async (req, res) => {
  const posts = await Post.find({postedBy:req.artistId})
  if (posts) {
    return res.status(200).json({ success: "ok", posts });
  }
  return res.status(200).json({ error: "No posts available" });
});

exports.deletePost = catchAsync(async (req, res) => {
  const { id } = req.body;
  await Post.findByIdAndDelete(id)
  const artist = await Artist.findByIdAndUpdate(
    req.artistId,
    { $pull: { posts: id } },
    { new: true }
  );

  if (artist) {
    return res.status(200).json({ success: "post deleted successfully" });
  }

  return res.status(200).json({ error: "delete post failed" });
});

exports.editArtistProfile = catchAsync(async (req, res) => {
  const {
    name,
    mobile,
    experience,
    worksDone,
    interest,
    qualification,
    language,
    category,
  } = req.body;
  if (req.body.artistProfile) {
    const updatedArtist = await Artist.findByIdAndUpdate(
      { _id: req.artistId },
      {
        $set: {
          name,
          mobile,
          interest,
          worksDone,
          educationalQualifications: qualification,
          YearOfExperience: experience,
          communicationLangauge: language,
          category,
          profile: req.body.artistProfile,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: "profile updated successfully", updatedArtist });
  }
  if (!req.body.artistProfile) {
    const updatedArtist = await Artist.findByIdAndUpdate(
      { _id: req.artistId },
      {
        $set: {
          name,
          mobile,
          interest,
          worksDone,
          educationalQualifications: qualification,
          YearOfExperience: experience,
          communicationLangauge: language,
          category,
        },
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: "profile updated successfully", updatedArtist });
  }
  return res.status(200).json({ error: "profile updating failed" });
});
