require("dotenv").config();
const jwt = require("jsonwebtoken");
// to hash  password (encrypt)
const bcrpt = require("bcrypt");
const randomString = require("randomstring");

const User = require("../models/user/userModel");
const catchAsync = require("../util/catchAsync");
const Mail = require("../util/otpMailer");

exports.register = catchAsync(async (req, res) => {
  const { name, mobile, email, password } = req.body;
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.json({ error: "User already exists" });
  }
  //hash password
  const hashPassword = await bcrpt.hash(password, 10);
  const user = new User({
    name,
    mobile,
    password: hashPassword,
    email,
  });
  const newUser = await user.save();
  if (newUser) {
    const newOtp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    await User.findOneAndUpdate({ email: email }, { $set: { otp: newOtp } });
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: "ArtHub register verification OTP",
      html: `<center> <h2>Verify Your Email </h2> <br> <h5>OTP :${newOtp}</h5><br><p>This otp is only valid for 2 minutes only</p></center>`,
    };
    await Mail.sendMail(options);
    return res.json({ success: "otp sented to mail", email });
  }
});

exports.verifyOtp = catchAsync(async (req, res) => {
  if (!req.body.otp) {
    return res.json({ error: "please enter otp" });
  }
  const user = await User.findOne({ email: req.body.email });
  if (req.body.otp === user.otp) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { isVerfied: true } }
    );
    return res.status(200).json({ success: "Otp verified successfully" });
  } else {
    return res.json({ error: "otp is invalid" });
  }
});

exports.verifyLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ error: "Email not found" });
  }
  const samePass = await bcrpt.compare(password, user.password);
  if (!samePass) {
    return res.json({ error: "invalid password" });
  }
  if (user.isBlocked) {
    return res.json({ error: "sorry,you are blocked by the Admin!" });
  }
  if (!user.isVerfied) {
    await User.findOneAndDelete({email:email})
    return res.json({ error: "sorry,you are not verified!, sign up again" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({ success: "Login Successfull",data:token });
});
