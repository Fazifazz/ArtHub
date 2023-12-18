const multer = require("multer");
const sharp = require("sharp");
const Artist = require("../../models/artist/artistModel");
const User = require("../../models/user/userModel");

const multerStorage = multer.memoryStorage();
const multerFilter = (res, file, cb) => {
  // const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image !, Please upload only Images", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadArtistPost = upload.single("post");

exports.resizeArtistPost = async (req, res, next) => {
  const artistId = req.artistId;
  const artist = await Artist.findById(artistId);

  try {
    if (!req.file) return next();
    req.file.filename = `artist-${artist.email}-${Date.now()}.jpeg`;
    req.body.artistPost = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/artistPosts/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};
exports.uploadArtistProfile = upload.single("profile");

exports.resizeArtistProfile = async (req, res, next) => {
  const artistId = req.artistId;
  const artist = await Artist.findById(artistId);

  try {
    if (!req.file) return next();
    req.file.filename = `artist-${artist.email}-${Date.now()}.jpeg`;
    req.body.artistProfile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/artistProfile/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};

exports.uploadUserProfile = upload.single("profile");

exports.resizeUserProfile = async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById({ _id: userId });

  try {
    if (!req.file) return next();
    req.file.filename = `user-${user.email}-${Date.now()}.jpeg`;
    req.body.userProfile = req.file.filename;
    await sharp(req.file.buffer)
      .resize(1080, 1080)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/userProfile/${req.file.filename}`);
    next();
  } catch (error) {
    res.json({ error: "error in resizing image" });
    console.log(error.message);
  }
};
