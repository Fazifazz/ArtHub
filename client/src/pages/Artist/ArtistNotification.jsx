import React, { useEffect, useState } from "react";
import ArtistNavbar from "../../components/ArtistNav";
import { MdClear } from "react-icons/md";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import { API_BASE_URL } from "../../config/api";

const ArtistNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // to check notification
  const getAllNotifications = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getArtistNotifications,
      method: "get",
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setNotifications(response.data?.notifications);
        }
      })
      .catch((error) => {
        dispatch(hideLoading())
        toast.error('something went wrong!')
        console.log(error);
      });
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${year}-${month}-${day} ${formattedHours}:${formattedMinutes}${ampm}`;
  };

  const clearAllNotifications = () => {
    ArtistRequest({
      url:apiEndPoints.clearArtistAllNotifications,
      method:'delete',
    }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.success)
        getAllNotifications()
      }
    })
    .catch((error) => {
      toast.error('something went wrong!')
      console.log(error);
    });
  };

  const clearMessage = (notificationId) => {
    ArtistRequest({
      url:apiEndPoints.deleteNotification,
      method:'delete',
      data:{notificationId}
    }).then((res) => {
      if (res.data.success) {
        toast.success(res.data.success)
        getAllNotifications()
      }
    })
    .catch((error) => {
      toast.error('something went wrong!')
      console.log(error);
    });
};


  return (
    <div>
      <ArtistNavbar />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center ">
            <h1 className="text-3xl font-extrabol text-slate-500 mb-11">
              Notifications
            </h1>
            <div className="clear-all-button">
              {notifications.length > 1 && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-full h-10 hover:bg-red-600"
                  onClick={() => clearAllNotifications()}
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          <div className="space-y-4 ">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <motion.div
                  key={item?._id}
                  whileHover={{scale:1.02}}
                  className="bg-gray-200 p-4 w-auto rounded-lg shadow-md flex items-center justify-between space-x-4"
                >
                  <div className="flex-grow">
                    <p className="text-gray-800 font-bold">
                      {item?.notificationMessage}
                    </p>
                    {item?.relatedPostId?<img onClick={()=>navigate(ServerVariables.artistPosts)} src={`${API_BASE_URL}/artistPosts/${item?.relatedPostId?.image}`}
                    className="w-10 h-10"
                    alt={item?.relatedPostId?.name}
                    />:''}
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-800 mr-4 font-bold">
                      {formatTime(item?.date)}
                    </p>
                    <button onClick={() => clearMessage(item?._id)}>
                      <MdClear fill="red" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-800 font-extrabold">
                No notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistNotification;