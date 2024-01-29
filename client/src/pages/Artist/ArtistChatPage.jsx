import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import socket from "../../components/SocketIo";
import ArtistNavbar from "../../components/ArtistNav";
import { CheckCircleIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { API_BASE_URL } from "../../config/api";

const ArtistChatPage = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null); // Updated to null
  const [filterData, setFilterData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getAllMessagedUsers();
  }, []);

  const getAllMessagedUsers = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getAllMessagedUsers,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setUsers(res?.data?.users);
        setFilterData(res?.data?.users);
      } else {
        toast.error(res.data.error);
      }
    });
  };

  const fetchChatMessages = async (userId) => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getPrevMessages,
      method: "post",
      data: { userId },
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setNewMessage("");
          socket.emit("setup", response.data?.artistId);
          socket.emit("join", response.data?.room_id);
          setChatPartner(response.data?.Data);
          setChatHistory(response.data?.msg);
          getAllMessagedUsers();
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
      if (message.userId === selectedUserId) {
        updateChatHistory(message);
        fetchChatMessages(selectedUserId);
      } else {
        getAllMessagedUsers();
      }
    });
    return () => {
      socket.off("message received");
    };
  }, [selectedUserId]);

  const sendNewMessage = async (room_id, userId) => {
    const Data = {
      newMessage: newMessage,
      rid: room_id,
      userId,
      time: new Date(),
    };
    if (newMessage.trim() === "") {
      return;
    } else {
      dispatch(showLoading());
      ArtistRequest({
        url: apiEndPoints.sendArtistNewMsg,
        method: "post",
        data: Data,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            setNewMessage("");
            fetchChatMessages(userId);

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

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    fetchChatMessages(userId);
    getAllMessagedUsers();
    // Focus on the input field when an artist is selected
    inputRef.current && inputRef.current.focus();
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const handleFilter = (e) => {
    const newData = filterData?.filter((item) =>
      item.userName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUsers(newData);
  };

  return (
    <>
      <ArtistNavbar />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-300">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-400 text-white">
            <h1 className="text-2xl font-semibold">My chats</h1>
            <div className="relative flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search..."
                className="border p-1 text-black sm:w-20 md:w-20 lg:w-40 xl:w-40" // Adjust width based on screen size
                onChange={handleFilter}
              />
            </div>
          </header>

          {/* Contact List */}
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            {users.length ? (
              users.map((user) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={user._id}
                  className={`flex items-center mb-4 cursor-pointer shadow-md hover:bg-green-100 p-2 rounded-md ${
                    selectedUserId === user.userId ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleUserClick(user.userId._id)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img
                      src={`${API_BASE_URL}/userProfile/${user.userId?.profile}`}
                      alt={`Avatar of ${user.userId?.name}`}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1 flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {user.userId?.name}
                      </h2>
                      {user?.latestMessage ? (
                        <p className="text-slate-600">
                          {user?.latestMessageSenderId !== user.userId._id
                            ? `You: ${user?.latestMessage}`
                            : `${user?.userId?.name}: ${user?.latestMessage}`}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>

                    {user?.unseenMessagesCount > 0 ? (
                      <span className="bg-green-500 text-white rounded-full px-2 py-1 text-sm mr-2 sm:w-6 sm:h-7 sm:ml-2 md:text-xs">
                        {user?.unseenMessagesCount}
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
        </div>

        {/* Main Chat Area */}
        <div className="flex-1">
          {/* Chat Header */}
          <header className="bg-green-100 p-4 text-gray-700 flex items-center justify-between">
            {chatPartner ? (
              <>
                <img
                  src={`${API_BASE_URL}/userProfile/${chatPartner?.userId?.profile}`}
                  alt={`Avatar of ${chatPartner?.userId?.name}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h1 className="uppercase text-2xl font-semibold ml-11">
                  {chatPartner?.userId?.name}
                </h1>
                <VideoCameraIcon
                  height={40}
                  onClick={() =>
                    navigate(
                      `/artistVideoCall/${chatPartner.artistId._id}/${chatPartner.userId._id}`
                    )
                  }
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-semibold">
                  Select an user to message
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
              const isArtistChat = message.senderId === message.artistId;
              const timeAgo = formatDistanceToNow(new Date(message.time), {
                addSuffix: true,
              });

              return (
                <div
                  key={message._id}
                  className={`flex mb-4 cursor-pointer ${
                    isArtistChat ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                    <img
                      src={
                        isArtistChat
                          ? `${API_BASE_URL}/artistProfile/${chatPartner?.artistId?.profile}`
                          : `${API_BASE_URL}/userProfile/${chatPartner?.userId?.profile}`
                      }
                      alt={`${message.sender}'s Avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <div
                    className={`flex max-w-96 ${
                      isArtistChat
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    } rounded-lg p-3 gap-3`}
                  >
                    <p>{message.message}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-2 self-end">
                    {timeAgo}{" "}
                    {isArtistChat && message.isUserSeen ? (
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
                    sendNewMessage(chatPartner?._id, chatPartner?.userId._id);
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

export default ArtistChatPage;
