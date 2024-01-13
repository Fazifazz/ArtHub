import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../util/ServerVariables";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutArtist } from "../redux/ArtistAuthSlice";
import Modal from "react-modal";
import socket from "./SocketIo";
import toast from "react-hot-toast";
import { ArtistRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import CallingUi from "./CallingUi";

const ArtistNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState("Home");
  const [Ntcount, setNtCount] = useState(0);
  const [MsgCount, setMsgCount] = useState(0);
  const location = useLocation();
  const [sender, setSender] = useState({});
  const [meetLink, setMeetLink] = useState("");
  const [openVideoCallModal, setOpenVideoCAllModal] = useState(false);

  const { artist } = useSelector((state) => state.ArtistAuth);

  useEffect(() => {
    // Handle the notification event
    socket.on("artistNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });
    socket.on("videoCallInvitation", (data) => {
      console.log("Received video call invitation", data);
      setSender(data?.sender);
      setMeetLink(data?.meetLink);
      setOpenVideoCAllModal(true);
      console.log(sender);
      console.log(meetLink);
    });

    return () => {
      console.log("Cleanup useEffect");
      socket.off("artistNotification");
      socket.off("videoCallInvitation");
    };
  }, []);

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const closeModal = () => {
    socket.emit("videoCallResponse", {
      userId: sender._id,
      accepted: false,
    });
    setOpenVideoCAllModal(false);
  };

  useEffect(() => {
    ArtistRequest({
      url: apiEndPoints.getArtistNotificationCount,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setNtCount(res.data?.count);
          if (location.pathname !== ServerVariables.artistChatPage) {
            setMsgCount(res.data?.messagesCount);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [Ntcount, MsgCount]);

  let adjustedNtcount = Ntcount;
  let adjustedMsgcount = MsgCount;

  if (Ntcount > 10) {
    if (Ntcount > 1000) {
      adjustedNtcount = "999+";
    } else if (Ntcount > 100) {
      adjustedNtcount = "99+";
    } else if (Ntcount > 50) {
      adjustedNtcount = "50+";
    } else if (Ntcount > 20) {
      adjustedNtcount = "20+";
    } else if (Ntcount > 10) {
      adjustedNtcount = "10+";
    } else {
      adjustedNtcount = Ntcount;
    }
  }
  if (MsgCount > 10) {
    if (MsgCount > 1000) {
      adjustedMsgcount = "999+";
    } else if (MsgCount > 100) {
      adjustedMsgcount = "99+";
    } else if (MsgCount > 50) {
      adjustedMsgcount = "50+";
    } else if (MsgCount > 20) {
      adjustedMsgcount = "20+";
    } else if (MsgCount > 10) {
      adjustedMsgcount = "10+";
    } else {
      adjustedMsgcount = MsgCount;
    }
  }

  useEffect(() => {
    if (location.state) {
      const { data } = location.state;
      setActiveItem(data);
    }
  }, [location.state]);

  const artistData = {
    name: artist.name,
    email: artist.email,
    imageUrl: `http://localhost:5000/artistProfile/${artist.profile}`,
  };

  const navigation = [
    { name: "Home", navigation: ServerVariables.ArtistHome },
    { name: "About", navigation: ServerVariables.aboutPage },
    { name: "Plans", navigation: ServerVariables.plansAvailable },
    { name: "My Posts", navigation: ServerVariables.artistPosts },
    { name: "Subscriptions", navigation: ServerVariables.mySubscriptions },
  ];

  const handleLogout = async () => {
    dispatch(logoutArtist());
  };
  const userNavigation = [
    { name: "Your Profile", navigation: ServerVariables.artistProfile },
    { name: "Logout", navigation: "#" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                <img
                    className="h-36 w-34"
                    src="/images/userImages/hub1.png"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        onClick={() =>
                          navigate(item.navigation, {
                            state: { data: item.name },
                          })
                        }
                        className={
                          item.name === activeItem
                            ? "bg-blue-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                        }
                        aria-current={
                          item.name === activeItem ? "page" : undefined
                        }
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => navigate(ServerVariables.artistChatPage)}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View Chats</span>
                    <div className="relative inline-block">
                      <ChatBubbleLeftRightIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />

                      {MsgCount > 0 && (
                        <>
                          <span className="absolute top-0  bg-red-500 text-white rounded-full px-1  text-xs">
                            {adjustedMsgcount}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() =>
                      navigate(ServerVariables.artistNotifications)
                    }
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <div className="relative inline-block">
                      <BellIcon className="h-6 w-6" aria-hidden="true" />

                      {Ntcount > 0 && (
                        <>
                          <span className="absolute top-0  bg-red-500 text-white rounded-full px-1  text-xs">
                            {adjustedNtcount}
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`http://localhost:5000/artistProfile/${artist.profile}`}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                onClick={() =>
                                  item.name === "Logout"
                                    ? handleLogout()
                                    : navigate(item.navigation)
                                }
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  onClick={() => {
                    navigate(item.navigation, { state: { data: item.name } });
                  }}
                  className={
                    item.name === activeItem
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                  }
                  aria-current={item.name === activeItem ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={artistData?.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {artistData?.name}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {artistData?.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => navigate(ServerVariables.artistChatPage)}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View Chats</span>
                  <ChatBubbleLeftRightIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  onClick={() => navigate(ServerVariables.artistNotifications)}
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <div className="relative inline-block">
                    <BellIcon className="h-6 w-6" aria-hidden="true" />

                    {Ntcount > 0 && (
                      <>
                        <span className="absolute top-0  bg-red-500 text-white rounded-full px-1  text-xs">
                          {adjustedNtcount}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    onClick={() =>
                      item.name === "Logout"
                        ? handleLogout()
                        : navigate(item.navigation)
                    }
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
          <Modal
            isOpen={openVideoCallModal}
            onRequestClose={closeModal}
            ariaHideApp={false}
            style={customStyles}
          >
            {/* Use the CommentModal component */}
            <CallingUi
              isOpen={openVideoCallModal}
              closeModal={closeModal}
              sender={sender}
              link={meetLink}
            />
          </Modal>
        </>
      )}
    </Disclosure>
  );
};

export default ArtistNavbar;
