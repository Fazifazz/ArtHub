require("dotenv").config();
const jwt = require("jsonwebtoken");
const Artist = require("../../models/artist/artistModel");

module.exports = async (req, res, next) => {
  try {
    const artistToken = req.headers["authorization"];
    jwt.verify(
      artistToken,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log(err.message);
          return res.json({
            error: "Authentication failed",
          });
        }
        req.artistId = decoded?.id;
        const artist = await Artist.findById(req.artistId);
        const currentDate = new Date();
        if (artist.subscription.transactionId) {
          if (artist.subscription.expiresAt < currentDate) {
            await Artist.updateOne(
              { _id: artist._id },
              { $set: { isSubscribed: false }, $unset: { subscription: 1 } }
            );
          }
        }
        next();
      }
    );
  } catch (error) {
    console.error(error);
    return res.json({ error: "Internal server error" });
  }
};
