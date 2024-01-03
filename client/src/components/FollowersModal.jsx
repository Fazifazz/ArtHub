import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import toast from "react-hot-toast";

const FollowersModal = ({ isOpen, closeModal, artistId }) => {
  const dispatch = useDispatch();
  const [Followers, setFollowers] = useState([]);

  useEffect(() => {
    getFollowers(artistId);
  }, []);

  const getFollowers = async (id) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getArtistFollowers,
      method: "post",
      data: { artistId: id },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setFollowers(res.data.followers);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error("something went wrong!");
        console.log(err.message);
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
        <h1 className="text-slate-500 font-semibold">Followers</h1>
        {Followers.length
          ? Followers.map((follower) => (
              <div className="flex items-center mt-4" key={follower._id}>
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={`http://localhost:5000/userProfile/${follower?.profile}`}
                  alt=""
                />
                <div className="flex-grow flex justify-between">
                  <small className="text-black font-semibold">
                    {follower.name}
                  </small>{" "}
                  <small className="ml-3">{follower.email}</small>
                  <small className="text-blue-400 ml-3">
                    {follower.mobile}
                  </small>
                </div>
              </div>
            ))
          : <p className="text-center text-slate-500">No followers found!..</p>}
      </div>
    </Modal>
  );
};

export default FollowersModal;
