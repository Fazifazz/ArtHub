const Chat = require("../models/user/chatModel");
const ChatMessages = require("../models/user/chatMessage");
const User = require("../models/user/userModel");
const Artist = require("../models/artist/artistModel");
const catchAsync = require("../util/catchAsync");
const chatModel = require("../models/user/chatModel");

exports.getArtistsUserFollow = catchAsync(async (req, res) => {
  const user = await User.findById(req.userId).populate("followings");
  if (!user) {
    return res.json({ error: "user not found" });
  }
  const artists = user.followings;
  return res.status(200).json({ success: "ok", artists });
});

exports.getChatMessages = catchAsync(async (req, res) => {
  const { artistId } = req.body;
  const chatConnectionData = await Chat.find({
    userId: req.userId,
    artistId: artistId,
  });

  if (chatConnectionData.length > 0) {
    const chatConnectionData = await Chat.findOne({
      userId: req.userId,
      artistId: artistId,
    });
    const room_id = chatConnectionData._id;
    const Messages = await ChatMessages.find({ room_id: room_id }).sort({
      time: 1,
    });
    if (Messages.length > 0) {
      res.status(200).json({
        Data: chatConnectionData,
        msg: Messages,
        success: true,
        room_id: room_id,
        userId: req.userId,
      });
    } else {
      // Handle the case where there are no messages
      res.status(200).json({
        Data: chatConnectionData,
        success: true,
        room_id,
        userId: req.userId,
      });
    }
  } else {
    const artist = await Artist.findById(artistId);
    const userData = await User.findById(req.userId);
    const Data = {
      userId: req.userId,
      artistId,
      artistImage: artist?.profile,
      artistName: artist?.name,
      userName: userData?.name,
      userImage: userData?.profile,
    };
    const newChatConnection = new Chat(Data);
    const savedNewChat = await newChatConnection.save();
    res.status(200).json({ success: "message added", Data: savedNewChat });
  }
});

// to store new messages
exports.sendNewMessage = catchAsync(async (req, res) => {
  const room_id = req.body?.r_id;
  const senderId = req?.userId;

  const Data = {
    room_id: room_id,
    userId: req.userId,
    senderId: senderId,
    artistId: req.body?.artistId,
    message: req.body?.newMessage,
    time: req.body?.time,
  };

  const newData = new ChatMessages(Data);
  const savedData = await newData.save();

  res.status(200).send({ success: true, data: savedData });
});

exports.getUserChatList = catchAsync(async (req, res) => {
  const artistId = req.artistId;

  const data = await Chat.find({ artistId: artistId });
  const count = data.length;

  if (data.length > 0) {
    res.status(200).send({ users: data, success: true });
  } else {
    res.status(200).send({ success: true });
  }
});

//  get room
exports.artistGetRoom = catchAsync(async (req, res) => {
  const artistId = req.artistId;
  const userId = req.body.userId;

  const chatConnectionData = await Chat.findOne({
    userId: userId,
    artistId: artistId,
  });
  const room_id = chatConnectionData._id;

  const Messages = await ChatMessages.find({ room_id: room_id }).sort({
    time: 1,
  });

  if (Messages.length > 0) {
    res.status(200).json({
      Data: chatConnectionData,
      msg: Messages,
      success: true,
      room_id,
      artistId,
    });
  } else {
    // Handle the case where there are no messages
    res
      .status(200)
      .send({ Data: chatConnectionData, success: true, room_id, artistId });
  }
});

// to post new message
exports.artistNewMessage = async (req, res) => {
  try {
    const senderId = req.artistId;
    const artistId = req.artistId;
    const room_id = req.body.rid;

    const Data = {
      room_id: room_id,
      userId: req.body.userId,
      senderId: senderId,
      artistId: artistId,
      message: req.body.newMessage,
      time: req.body.time,
    };

    const newData = new ChatMessages(Data);
    const savedData = await newData.save();

    res.status(200).json({ success: true, data: savedData });
  } catch (error) {
    console.log(error, " at developerNewMessage");
  }
};

// // to check notifications
// const checkNotification = async (req, res) => {

//     try {

//         const Id = req.body.developerId

//         const seenUpdate = await notificationModel.updateMany({ developerId: Id, seen: false }, { $set: { seen: true } })
//         const Data = await notificationModel.find({ developerId: Id, seen: true }).sort({ date: -1 });
//         res.status(200).send({ data: Data, success: true })
//     }

//     catch (error) {
//         console.log(error, "At checkNotification ")
//     }
// }
