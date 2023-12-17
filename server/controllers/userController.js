require("dotenv").config();
const jwt = require("jsonwebtoken"),
  // to hash  password (encrypt)
  bcrypt = require("bcrypt"),
  randomString = require("randomstring"),
  otpTemplate = require("../util/otpTemplate"),
  User = require("../models/user/userModel"),
  Artist = require("../models/artist/artistModel"),
  catchAsync = require("../util/catchAsync"),
  Mail = require("../util/otpMailer");

exports.register = catchAsync(async (req, res) => {
  const { name, mobile, email, password } = req.body;
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.json({ error: "User already exists" });
  }
  const mobileExists = await User.findOne({ mobile: mobile });
  if (mobileExists) {
    return res.json({ error: "mobile number already exists" });
  }
  //hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });
  const user = new User({
    name,
    mobile,
    password: hashPassword,
    email,
    otp: {
      code: newOtp,
      generatedAt: Date.now(),
    },
  });
  const newUser = await user.save();
  if (newUser) {
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: "ArtHub register verification OTP",
      html: otpTemplate(newOtp),
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
  if (req.body.otp === user.otp.code) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { isVerified: true } }
    );
    return res
      .status(200)
      .json({ success: "Otp verified successfully", email: req.body.email });
  } else {
    return res.json({ error: "otp is invalid" });
  }
});

exports.verifyLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.json({ error: "User not found" });
  }
  const samePass = await bcrypt.compare(password, user.password);
  if (!samePass) {
    return res.json({ error: "invalid password" });
  }
  if (user.isBlocked) {
    return res.json({ error: "sorry,you are blocked by the Admin!" });
  }
  if (!user.isVerified) {
    await User.findOneAndDelete({ email: email });
    return res.json({ error: "sorry,you are not verified!, sign up again" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.status(200).json({ success: "Login Successfull", token, user });
});

exports.ResendOtp = catchAsync(async (req, res) => {
  if (!req.body.email) {
    return console.log("email not found");
  }
  const user = await User.findOne({ email: req.body.email });
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

  user.otp.code = newOtp;
  user.otp.generatedAt = Date.now();
  await user.save();
  return res
    .status(200)
    .json({ success: "Otp Resended", email: req.body.email });
});

exports.forgetVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  const newOtp = randomString.generate({
    length: 4,
    charset: "numeric",
  });

  if (user) {
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: "ArtHub Email verification OTP for forget password",
      html: otpTemplate(newOtp),
    };
    await Mail.sendMail(options);
    await User.findOneAndUpdate(
      { email: email },
      { $set: { otp: { code: newOtp } } },
      { new: true }
    );
    return res.status(200).json({ success: "otp sended to your Email", email });
  }
});

exports.updatePassword = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  const hashPassword = await bcrypt.hash(password, 10);
  if (user) {
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ success: "password changed successfully" });
  }
  return res.status(200).json({ error: "password changing failed" });
});

exports.getAllPosts = catchAsync(async (req, res) => {
  const artistPosts = await Artist.aggregate([
    {
      $unwind: "$posts", // Deconstructs the posts array
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        artistId: "$_id", // Include the artistId field
        artistName: "$name", // Include the artistName field (replace with the actual field name)
        post: "$posts",
        profile: "$profile", // Include the post field
      },
    },
  ]);
  if (artistPosts) {
    return res.status(200).json({ success: "ok", artistPosts });
  }
  return res.status(200).json({ error: "failed" });
});

exports.likePost = catchAsync(async (req, res) => {
  const { id, artistId } = req.body;

  const artist = await Artist.findById(artistId);

  if (!artist) {
    return res
      .status(404)
      .json({ success: false, message: "Artist not found" });
  }

  const postIndex = artist.posts.findIndex(
    (post) => post._id.toString() === id
  );

  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  const alreadyLikedIndex = artist.posts[postIndex].likes.findIndex(
    (like) => like.user.toString() === req.userId
  );

  if (alreadyLikedIndex !== -1) {
    // Unlike the post
    artist.posts[postIndex].likes.splice(alreadyLikedIndex, 1);
  } else {
    // Like the post
    artist.posts[postIndex].likes.push({ user: req.userId});
  }

  await artist.save();
  res.status(200).json({ success: true });
});
