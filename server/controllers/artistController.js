require("dotenv").config();
const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  randomString = require("randomstring"),
  otpTemplate = require("../util/otpTemplate"),
  Artist = require("../models/artist/artistModel"),
  Banner = require("../models/admin/BannerModel"),
  PlansHistory = require("../models/admin/subscriptionHistoryModel"),
  Plan = require("../models/admin/planModel"),
  Category = require("../models/admin/categoryModel"), 
  Post = require("../models/artist/postModel"),
  Notification = require("../models/artist/notificationModel"),
  catchAsync = require("../util/catchAsync"),
  crypto = require("crypto"),
  Mail = require("../util/otpMailer"),
  paypal = require("paypal-rest-sdk");
const chatModel = require("../models/user/chatModel");
const chatMessage = require("../models/user/chatMessage");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
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
  if (!otp) {
    return res.json({ error: "please enter otp" });
  }
  const artist = await Artist.findOne({ email: email });
  const generatedAt = new Date(artist.otp.generatedAt).getTime();
  if (Date.now() - generatedAt <= 30 * 1000) {
    if (otp === artist.otp.code) {
      artist.isVerified = true;
      artist.otp.code = "";
      artist.otp.generatedAt = null;
      await artist.save();
      return res
        .status(200)
        .json({ success: "Otp verified successfully", email });
    } else {
      return res.json({ error: "otp is invalid" });
    }
  } else {
    return res.json({ error: "otp expired!" });
  }
});

exports.ResendOtp = catchAsync(async (req, res) => {
  if (!req.body.email) {
    return res.json({error:'email not found'})
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
      { $set: { otp: { code: newOtp, generatedAt: Date.now() } } },
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
  const artist = await Artist.findById(req?.artistId);
  let currentPlan = null;
  currentPlan = await Plan.findById(artist.subscription.currentPlan);
  if (currentPlan) {
    currentPlan = currentPlan.toObject();
    currentPlan.expiresOn = artist?.subscription?.expiresAt.toDateString();
  }

  return res.status(200).json({ success: "ok", plans, currentPlan });
});

exports.uploadPost = catchAsync(async (req, res) => {
  const { title, description, artistPost } = req.body;
  const artistId = req.artistId;
  const newPost = await Post.create({
    title,
    description,
    postedBy: artistId,
    image: artistPost,
  });

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
  const posts = await Post.find({ postedBy: req.artistId })
    .sort({ createdAt: -1 })
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        select: "name profile", // Replace 'User' with the actual model name for the user
      },
    })
    .populate("postedBy");
  if (posts) {
    return res.status(200).json({ success: "ok", posts });
  }
  return res.status(200).json({ error: "No posts available" });
});

exports.deletePost = catchAsync(async (req, res) => {
  const { id } = req.body;
  await Post.findByIdAndDelete(id);
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
    await chatModel.updateMany(
      { artistId: req.artistId },
      { $set: { artistImage: updatedArtist.profile } },
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

exports.subscriptionPayment = catchAsync(async (req, res) => {
  const { planId } = req.body;
  // Fetch plan details from your database based on planId
  const plan = await Plan.findById(planId);

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:5000/api/artist/successPayment?planId=${planId}&artistId=${req.artistId}`,
      cancel_url: "http://localhost:5000/api/artist/errorPayment",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: plan.name,
              sku: plan._id,
              price: plan.amount.toFixed(2),
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: plan.amount.toFixed(2),
        },
        description: plan.description,
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error creating PayPal payment" });
    } else {
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      ).href;
      res.json({ success: "approvalUrl sented", approvalUrl });
    }
  });
});

exports.showSuccessPage = catchAsync(async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const { planId, artistId } = req.query;
  const plan = await Plan.findById(planId);
  const artist = await Artist.findById(artistId);
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: plan.amount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        const response = JSON.stringify(payment);
        const parsedResponse = JSON.parse(response);
        const transactionId =
          parsedResponse.transactions[0].related_resources[0].sale.id;
        const currentDate = new Date();

        artist.subscription = {
          transactionId: transactionId,
          currentPlan: planId,
          expiresAt: new Date(
            currentDate.getTime() + plan.dayDuaration * 24 * 60 * 60 * 1000
          ),
        };
        artist.isSubscribed = true;
        artist.paymentHistory.push({
          planName: plan.name,
          expireDate: new Date(
            currentDate.getTime() + plan.dayDuaration * 24 * 60 * 60 * 1000
          ),
          date: currentDate,
          price: plan.amount,
          duration: plan.dayDuaration,
        });
        await artist.save();
        await PlansHistory.create({
          plan: plan._id,
          artist: artistId,
          date: currentDate,
          transactionId: transactionId,
          expireDate: new Date(
            currentDate.getTime() + plan.dayDuaration * 24 * 60 * 60 * 1000
          ),
        });
        return res.redirect("http://localhost:5173/successPage");
      }
    }
  );
});

exports.showErrorPage = catchAsync(async (req, res) => {
  console.log("payment failed!");
  return res.redirect("http://localhost:5173/errorPage");
});

exports.getPostComments = catchAsync(async (req, res) => {
  const post = await Post.findById(req.body.postId)
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        select: "name profile",
      },
    })
    .populate("postedBy");
  const comments = post.comments;
  if (comments?.length) {
    res.status(200).json({ success: "ok", comments });
  }
});

exports.replyUserComment = catchAsync(async (req, res) => {
  const { postId, commentId, reply } = req.body;
  const artist = await Artist.findById(req.artistId);
  const post = await Post.findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        select: "name profile",
      },
    })
    .populate("postedBy");
  const comment = post.comments.id(commentId);
  comment.replies.push({
    reply: reply,
    postedBy: artist._id,
  });

  await post.save();
  // to send notification to user
  const Notify = {
    receiverId: comment.postedBy._id,
    senderId: req.artistId,
    relatedPostId: post._id,
    notificationMessage: `${artist.name} replied '${reply}' to your comment '${comment.text}'`,
    date: new Date(),
  };
  const newNotification = new Notification(Notify);
  newNotification.save();
  return res
    .status(200)
    .json({ success: "reply added", comments: post.comments });
});

exports.deleteReply = catchAsync(async (req, res) => {
  const { replyId, postId, commentId } = req.body;
  const post = await Post.findById(postId)
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        select: "name profile", // Replace 'User' with the actual model name for the user
      },
    })
    .populate("postedBy");

  const comment = post.comments.id(commentId);
  comment.replies.pull(replyId);
  await post.save();

  return res.status(200).json({
    success: "reply deleted",
    post: post,
    reply: comment.replies.id(replyId),
  });
});

exports.getArtistNotifications = catchAsync(async (req, res) => {
  const Id = req.artistId;
  await Notification.updateMany(
    { receiverId: Id, seen: false },
    { $set: { seen: true } }
  );
  const notifications = await Notification.find({ receiverId: Id })
    .sort({
      date: -1,
    })
    .populate({
      path: "relatedPostId",
      populate: [
        {
          path: "postedBy",
          model: "artist",
        },
        {
          path: "comments.postedBy",
          model: "user",
        },
      ],
    });
  return res.status(200).json({ notifications, success: true });
});

exports.getNotificationCount = catchAsync(async (req, res) => {
  const artistId = req.artistId;
  const count = await Notification.countDocuments({
    receiverId: artistId,
    seen: false,
  });
  const messagesCount = await chatMessage
    .find({ artistId: artistId, isArtistSeen: false })
    .countDocuments();
  return res.status(200).json({ success: true, count, messagesCount });
});

exports.deleteNotification = catchAsync(async (req, res) => {
  const id = req.body?.notificationId;
  const deletedNotification = await Notification.findOneAndDelete({ _id: id });
  if (deletedNotification) {
    return res
      .status(200)
      .json({ success: "deleted notification successfully" });
  }
  return res.json({ error: "deleting notification failed" });
});

exports.clearAllNotification = catchAsync(async (req, res) => {
  const id = req.artistId;
  const clearNotifications = await Notification.deleteMany({
    receiverId: id,
    seen: true,
  });
  if (clearNotifications) {
    return res.status(200).json({ success: "All notifications cleared" });
  }
  return res.json({ error: "deleting notification failed" });
});

exports.getMySubscriptions = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 3;
  const SubscriptionHistory = await PlansHistory.find({
    artist: req.artistId,
  }).countDocuments();
  const totalPages = Math.ceil(SubscriptionHistory / pageSize);

  const histories = await PlansHistory.find({ artist: req.artistId })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("plan artist");

  return res.status(200).json({
    success: "ok",
    payments: histories,
    currentPage: page,
    totalPages,
  });
});

exports.getArtistBanners = catchAsync(async (req, res) => {
  const banners = await Banner.find({ isDeleted: false }).sort({
    createdAt: -1,
  });
  if (banners) {
    return res.status(200).json({ success: "ok", banners });
  }
  return res.json({ error: "failed to get banners" });
});

exports.getRatedUsers = catchAsync(async (req, res) => {
  const artist = await Artist.findById(req.artistId).populate({
    path: "ratings",
    populate: { path: "user", select: "name profile" },
  });
  const ratedUsers = artist.ratings;
  return res.status(200).json({ success: "ok", ratedUsers });
});


exports.checkCurrentArtistBlocked = catchAsync(async (req, res) => {
  const currentArtist= await Artist.findById(req.artistId);
  if (currentArtist.isBlocked) {
    return res.json({ error: "You are blocked by admin", currentArtist });
  }
  return res.status(200).json({ success: "ok" });
});