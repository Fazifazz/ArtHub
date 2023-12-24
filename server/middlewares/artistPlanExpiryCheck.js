const catchAsync = require("../util/catchAsync"),
  Artist = require("../models/artist/artistModel");

exports.isPlanExpired = catchAsync(async (req, res, next) => {
  const artist = await Artist.findById(req.artistId);
  const currentDate = new Date();
  if (artist.subscription.transactionId) {
    if (artist.subscription.expiresAt < currentDate) {
      await Artist.updateOne(
        { _id: artist._id },
        { $set: { isSubscribed: false }, $unset: { subscription: 1 } }
      );
      return res.json({ expired: "your plan has been expired!..." });
    } else {
      next();
    }
  } else {
    return res.json({ expired: "please Subscribe to a plan to continue" });
  }
});
