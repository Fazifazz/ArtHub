const User = require("../models/user/userModel");
const catchAsync = require("../util/catchAsync");

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
