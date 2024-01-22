import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import socket from "../../components/SocketIo";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ChatWithArtist = () => {
  const [artists, setArtists] = useState([]);
  const dispatch = useDispatch();
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [chatPartner, setChatPartner] = useState(null); // Updated to null
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    getAllArtistsYouFollow();
  }, []);

  const getAllArtistsYouFollow = async () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getArtistsFollowed,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setArtists(res?.data?.artists);
        setFilterData(res?.data?.artists);
      } else {
        toast.error(res.data.error);
      }
    });
  };

  const fetchChatMessages = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getChatMessages,
      method: "post",
      data: { artistId },
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setNewMessage("");
          socket.emit("setup", response.data?.userId);
          socket.emit("join", response.data?.room_id);
          setChatPartner(response.data?.Data);
          setChatHistory(response.data?.msg);
          getAllArtistsYouFollow();
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("something went wrong!");
      });
  };

  const updateChatHistory = (message) => {
    setChatHistory((prevHistory) => [...(prevHistory || []), message]);
  };

  useEffect(() => {
    socket.on("message received", (message) => {
      if (message.artistId === selectedArtistId) {
        updateChatHistory(message);
        fetchChatMessages(selectedArtistId);
      } else {
        getAllArtistsYouFollow();
      }
    });
    return () => {
      socket.off("message received");
    };
  }, [selectedArtistId]);

  const sendChatMessage = async (room_id, artistId) => {
    const Data = {
      newMessage: newMessage,
      r_id: room_id,
      artistId,
      time: new Date(),
    };
    if (newMessage.trim() === "") {
      return;
    } else {
      dispatch(showLoading());
      userRequest({
        url: apiEndPoints.sendNewMessage,
        method: "post",
        data: Data,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            setNewMessage("");
            fetchChatMessages(artistId);

            var obj = response.data.data;
            if (!obj.senderId) {
              obj.senderId = response.data.data.userId;
            }

            socket.emit("chatMessage", obj);
            const datas = response.data.data;
            setChatHistory([...chatHistory, datas]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleArtistClick = (artistId) => {
    fetchChatMessages(artistId);
    setSelectedArtistId(artistId);
    getAllArtistsYouFollow();
    // Focus on the input field when an artist is selected
    inputRef.current && inputRef.current.focus();
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleFilter = (e) => {
    const newData = filterData?.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setArtists(newData);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}

        <div className="w-1/4 bg-white border-r border-gray-300">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between  items-center bg-gray-400 text-white">
            <h1 className="text-2xl font-semibold">My chats</h1>
            <div className="relative flex items-center mt-2 sm:mt-0">
              {" "}
              {/* Adjusted margin for small screens */}
              <input
                type="text"
                placeholder="Search..."
                className="border p-1 text-black sm:w-20 md:w-20 lg:w-40 xl:w-40" // Adjust width based on screen size
                onChange={handleFilter}
              />
            </div>
          </header>

          {artists.length ? (
            artists.map((artist) => (
              <motion.div
                whileHover={{ scale: 1.012 }}
                key={artist._id}
                className={`flex items-center mb-4 shadow-md cursor-pointer hover:bg-green-100 p-2 rounded-md ${
                  selectedArtistId === artist._id ? "bg-green-100" : ""
                }`}
                onClick={() => handleArtistClick(artist._id)}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                  <img
                    src={`http://localhost:5000/artistProfile/${artist.profile}`}
                    alt={`Avatar of ${artist.name}`}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{artist.name}</h2>
                    {artist?.latestMessage ? (
                      <p className="text-slate-600">
                        {artist?.latestMessageSenderId !== artist._id
                          ? `You: ${artist?.latestMessage}`
                          : `${artist?.name}: ${artist?.latestMessage}`}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  {artist?.unseenMessagesCount > 0 ? (
                    <span className="bg-green-500 text-white rounded-full px-2 py-1 text-sm mr-2 sm:w-6 sm:h-7 sm:ml-2 md:text-xs">
                      {artist?.unseenMessagesCount}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full p-4 flex items-center justify-center">
              <div className="text-xl font-bold text-center">
                No connections
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}

        <div className="flex-1">
          {/* Chat Header */}
          <header className="bg-green-100 p-4 text-gray-700 flex items-center justify-between">
            {chatPartner ? (
              <>
                <img
                  src={`http://localhost:5000/artistProfile/${chatPartner?.artistId?.profile}`}
                  alt={`Avatar of ${chatPartner?.artistId?.name}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h1 className="uppercase text-2xl font-semibold ml-11">
                  {chatPartner?.artistId?.name}
                </h1>
                <VideoCameraIcon
                  height={40}
                  onClick={() =>
                    navigate(
                      `/userVideoCall/${chatPartner?.userId?._id}/${chatPartner?.artistId?._id}`
                    )
                  }
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                  Select an artist to message
                </h1>
              </div>
            )}
          </header>
          {/* Chat Messages */}
          <div
            className="h-screen overflow-y-auto p-4 pb-36 bg-gray-200"
            ref={chatContainerRef}
          >
            {chatHistory?.map((message) => {
              const isUserChat = message.senderId === message.userId;
              const timeAgo = formatDistanceToNow(new Date(message.time), {
                addSuffix: true,
              });

              return (
                <div
                  key={message._id}
                  className={`flex mb-4 cursor-pointer ${
                    isUserChat ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src={
                        isUserChat
                          ? `http://localhost:5000/userProfile/${chatPartner?.userId?.profile}`
                          : `http://localhost:5000/artistProfile/${chatPartner?.artistId?.profile}`
                      }
                      alt={`${message.sender}'s Avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div
                    className={`flex max-w-96 ${
                      isUserChat
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    } rounded-lg p-3 gap-3`}
                  >
                    <p>{message.message}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-2 self-end">
                    {timeAgo}{" "}
                    {isUserChat && message.isArtistSeen ? (
                      <>
                        seen
                        <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
            {chatHistory && chatHistory.length === 0 ? (
              <div className="flex items-center justify-center mt-10 text-slate-500">
                <h1 className="text-2xl font-semibold">Go and chat...</h1>
              </div>
            ) : null}
          </div>

          {/* Chat Input */}
          {chatPartner ? (
            <footer className="bg-gray-100 border-t border-gray-500 p-4 fixed bottom-0 w-3/4">
              <div className="flex items-center">
                <input
                  type="text"
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
                  onClick={() => {
                    sendChatMessage(
                      chatPartner?._id,
                      chatPartner?.artistId._id
                    );
                  }}
                >
                  Send
                </button>
              </div>
            </footer>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWithArtist;
