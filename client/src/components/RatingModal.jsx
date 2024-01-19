import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function RatingModal({ isOpen, closeModal, artistId }) {
  const { user } = useSelector((state) => state.Auth);
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    userRequest({
      url: apiEndPoints.chechUserRating,
      method: "post",
      data: { artistId },
    }).then((res) => {
      if (res.data.success) {
        setRating(res.data.rating);
      }
    });
  }, []);

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const addRatingToArtist = async (artistId) => {
    if (!rating) {
      return toast.error("add stars to rate artist...");
    }
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.addRatingToArtist,
      method: "post",
      data: { rating, artistId },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    });
  };

  const renderStars = () => {
    const stars = [];
    const totalStars = rating !== null ? rating : "";
    for (let i = 0; i < 5; i++) {
      const starClassName =
        i < totalStars
          ? "text-yellow-500"
          : "text-gray-500 hover:text-gray-600";
      stars.push(
        <svg
          key={i}
          className={`w-12 h-12 ${starClassName}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={() => handleStarClick(i)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
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
      <div className="py-3 sm:max-w-xl sm:mx-auto">
        <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
          <div className="px-12 py-5">
            <h2 className="text-gray-800 text-3xl font-semibold">
              Your opinion matters to us!
            </h2>
          </div>
          <div className="bg-gray-200 w-full flex flex-col items-center">
            <div className="flex flex-col items-center py-6 space-y-3">
              <span className="text-lg text-gray-800">
                Rate this artist out of 5?
              </span>
              <div className="flex space-x-3">{renderStars()}</div>
            </div>
            <div className="w-3/4 flex flex-col">
              <button
                className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
                onClick={() => addRatingToArtist(artistId)}
              >
                Rate Now
              </button>
            </div>
          </div>
          <div className="h-20 flex items-center justify-center">
            <a href="#" className="text-gray-600" onClick={closeModal}>
              Maybe later
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RatingModal;
