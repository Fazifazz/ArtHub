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
import { VideoCameraIcon } from "@heroicons/react/24/outline";

const ArtistChatPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null); // Updated to null
  const [roomId, setRoomid] = useState("");
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
        setUsers(res.data.users);
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
          setRoomid(response.data?.room_id);
          setChatPartner(response.data?.Data);
          setChatHistory(response.data?.msg);
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
      if (message.userId === selectedUserId) updateChatHistory(message);
    });
    return () => {
      socket.off("message received");
    };
  }, [selectedUserId]);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = (e) => {
    if (
      !document.getElementById("menuDropdown").contains(e.target) &&
      !document.getElementById("menuButton").contains(e.target)
    ) {
      setIsMenuOpen(false);
    }
  };

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
    fetchChatMessages(userId);
    setSelectedUserId(userId);
    // Focus on the input field when an artist is selected
    inputRef.current && inputRef.current.focus();
  };

  const chatContainerRef = useRef(null);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <>
      <ArtistNavbar />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-300">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-gray-400 text-white">
            <h1 className="text-2xl font-semibold">My chats</h1>
            <div className="relative">
              <button
                id="menuButton"
                className="focus:outline-none"
                onClick={toggleMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                </svg>
              </button>
              {/* Menu Dropdown */}
              <div
                id="menuDropdown"
                className={`absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ${
                  isMenuOpen ? "" : "hidden"
                }`}
              >
                <ul className="py-2 px-3">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:text-gray-400"
                    >
                      Option 1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-800 hover:text-gray-400"
                    >
                      Option 2
                    </a>
                  </li>
                  {/* Add more menu options here */}
                </ul>
              </div>
            </div>
          </header>

          {/* Contact List */}
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            {users.length ? (
              users.map((user) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={user._id}
                  className={`flex items-center mb-4 cursor-pointer hover:bg-green-100 p-2 rounded-md ${
                    selectedUserId === user.userId ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleUserClick(user.userId)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img
                      src={`http://localhost:5000/userProfile/${user.userImage}`}
                      alt={`Avatar of ${user.userName}`}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{user.userName}</h2>
                    {/* <p className="text-gray-600">
                      {user.hasChat ? "last message" : "No messages yet"}
                    </p> */}
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
                  src={`http://localhost:5000/userProfile/${chatPartner?.userImage}`}
                  alt={`Avatar of ${chatPartner?.userName}`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h1 className="uppercase text-2xl font-semibold ml-11">
                  {chatPartner?.userName}
                </h1>
                <VideoCameraIcon
                  height={40}
                  onClick={() =>
                    navigate(`/artistVideoCall/${chatPartner.artistId}`)
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
                          ? `http://localhost:5000/artistProfile/${chatPartner?.artistImage}`
                          : `http://localhost:5000/userProfile/${chatPartner?.userImage}`
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
                    {timeAgo}
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
                    sendNewMessage(chatPartner?._id, chatPartner?.userId);
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
