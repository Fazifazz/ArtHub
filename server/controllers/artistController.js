require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const otpTemplate = require('../util/otpTemplate')
const Artist = require("../models/artist/artistModel");
const Category = require("../models/admin/categoryModel");
const catchAsync = require("../util/catchAsync");
const Mail = require("../util/otpMailer");


exports.getCategories = catchAsync(async (req, res) => {
    const categories = await Category.find({});
    if (categories) {
      res.status(200).json({ success: "ok", categories });
    }
  });

exports.register = catchAsync(async (req, res) => {
    const { name, mobile, email, password,experience,worksDone,interest,qualification,language,category } = req.body;
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
    const artist = new Artist({
      name,
      mobile,
      password: hashPassword,
      email,
      YearOfExperience:experience,
      worksDone,
      interest,
      educationalQualifications:qualification,
      communicationLangauge:language,
      category,
      otp:{
        code:newOtp,
        generatedAt:Date.now()
      }
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
    if (!req.body.otp) {
      return res.json({ error: "please enter otp" });
    }
    const artist = await Artist.findOne({ email: req.body.email });
    if (req.body.otp === artist.otp.code) {
      await Artist.findOneAndUpdate(
        { email: req.body.email },
        { $set: { isVerified: true } }
      );
      return res.status(200).json({ success: "Otp verified successfully",email:req.body.email });
    } 
      return res.json({ error: "otp is invalid" });
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
    if (!artist.isVerified) {
      await Artist.findOneAndDelete({ email: email });
      return res.json({ error: "sorry,you are not verified!, sign up again" });
    }
    const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({ success: "Login Successfull", token,artist });
  });

  
  exports.forgetVerifyEmail = catchAsync(async(req,res)=>{
    const {email} = req.body;
    const artist = await Artist.findOne({email:email})
    console.log(artist)
    const newOtp = randomString.generate({
      length: 4,
      charset: "numeric",
    });
    if(artist){
      const options = {
        from: process.env.EMAIL,
        to: email,
        subject: "ArtHub Email verification OTP for forget password",
        html: otpTemplate(newOtp),
      };
      await Mail.sendMail(options);
      await Artist.findOneAndUpdate({email:email},{$set:{otp:{code:newOtp}}},{new:true})
      return res.status(200).json({success:'otp sended to your Email',email})
    }
  })  

  exports.updatePassword = catchAsync(async(req,res)=>{
    const {email,password} = req.body;
    const artist = await Artist.findOne({email:email})
    const hashPassword = await bcrypt.hash(password,10)
    if(artist){
      artist.password = hashPassword
      await artist.save()
     return res.status(200).json({success:'password changed successfully'})
    }
    return res.status(200).json({error:'password changing failed'})
  })