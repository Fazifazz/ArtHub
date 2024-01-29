import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import toast from "react-hot-toast";
import { updateUser } from "../redux/AuthSlice";
import { updateArtist } from "../redux/ArtistAuthSlice";
import { API_BASE_URL } from "../config/api";

const FollowingsModal = ({ isOpen, closeModal }) => {
  const dispatch = useDispatch();
  const [followings, setfollowings] = useState([]);

  useEffect(() => {
    getFollowings();
  }, []);

  const getFollowings = async () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getUserFollowings,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setfollowings(res.data.followings);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error("something went wrong!");
        console.log(err.message);
      });
  };

  const handleUnFollow = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.unFollowArtist,
      method: "post",
      data: { artistId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          dispatch(updateUser(res.data.updatedUser));
          dispatch(updateArtist(res.data.updatedArtist));
          getFollowings();
          return;
        }
        return toast.error(res.data.error);
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("Something went wrong");
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "500px", // Increased width to accommodate comments
          maxHeight: "500px",
          overflowY: "auto",
        },
      }}
    >
      <div className="mt-2 mb-2">
        <h1 className="text-slate-500 font-semibold">followings</h1>
        {followings.length ? (
          followings.map((following) => (
            <div className="flex items-center mt-4" key={following._id}>
              <img
                className="h-8 w-8 rounded-full mr-2"
                src={`${API_BASE_URL}/artistProfile/${following?.profile}`}
                alt=""
              />
              <div className="flex-grow flex justify-between">
                <small className="text-black font-semibold">
                  {following.name}
                </small>{" "}
                <button
                  className="w-20 h-7 text-white bg-gray-600 rounded hover:bg-gray-700"
                  onClick={() => handleUnFollow(following._id)}
                >
                  Unfollow
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500">No followings found!..</p>
        )}
      </div>
    </Modal>
  );
};

export default FollowingsModal;
