const Chat = require("../models/user/chatModel");
const ChatMessages = require("../models/user/chatMessage");
const User = require("../models/user/userModel");
const Artist = require("../models/artist/artistModel");
const catchAsync = require("../util/catchAsync");

exports.getArtistsUserFollow = catchAsync(async (req, res) => {
  const user = await User.findById(req.userId).populate("followings");
  if (!user) {
    return res.json({ error: "user not found" });
  }
  
  const artists = user.followings;
  const artistsWithUnseenMessages = await Promise.all(
    artists.map(async (artist) => {
      const artistId = artist._id;
      const unseenMessagesCount = await ChatMessages.countDocuments({
        artistId: artistId,
        isUserSeen: false, // Add any additional conditions if needed
      });

      return {
        ...artist.toObject(),
        unseenMessagesCount,
      };
    })
  );
  return res
    .status(200)
    .json({ success: "ok", artists: artistsWithUnseenMessages });
});

exports.getChatMessages = catchAsync(async (req, res) => {
  const { artistId } = req.body;
  const chatConnectionData = await Chat.find({
    userId: req.userId,
    artistId: artistId,
  })


  if (chatConnectionData.length > 0) {
    const chatConnectionData = await Chat.findOne({
      userId: req.userId,
      artistId: artistId,
    }).populate('userId artistId')
    const room_id = chatConnectionData._id;
    const Messages = await ChatMessages.find({ room_id: room_id }).sort({
      time: 1,
    });
    await ChatMessages.updateMany(
      { room_id: room_id, isUserSeen: false },
      { $set: { isUserSeen: true } }
    );
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
    const Data = {
      userId: req.userId,
      artistId,
    };
    const newChatConnection = new Chat(Data);
    const savedNewChat = await newChatConnection.save();
    const connection = await Chat.findById(savedNewChat._id).populate('userId artistId')
    res.status(200).json({ success: "message added", Data: connection });
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

  const users = await Chat.find({ artistId: artistId }).populate('userId artistId')
  const userWithUnseenMessages = await Promise.all(
    users.map(async (user) => {
      const userId = user.userId;
      const unseenMessagesCount = await ChatMessages.countDocuments({
        userId: userId,
        isArtistSeen: false, // Add any additional conditions if needed
      });

      return {
        ...user.toObject(),
        unseenMessagesCount,
      };
    })
  );
  // console.log('contacts',userWithUnseenMessages)

    res.status(200).send({ users: userWithUnseenMessages, success: true });  
});

//  get room
exports.artistGetRoom = catchAsync(async (req, res) => {
  const artistId = req.artistId;
  const userId = req.body.userId;

  const chatConnectionData = await Chat.findOne({
    userId: userId,
    artistId: artistId,
  }).populate('userId artistId')
  const room_id = chatConnectionData?._id;

  const Messages = await ChatMessages.find({ room_id: room_id }).sort({
    time: 1,
  });
  await ChatMessages.updateMany(
    { room_id: room_id, isArtistSeen: false },
    { $set: { isArtistSeen: true } }
  );

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
