import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "react-modal";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { ArtistRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import StarRating from "./StarRating";

function RatedUsersModal({ isOpen, closeModal }) {
  const dispatch = useDispatch();
  const [ratedUsers, setRatedUsers] = useState([]);

  useEffect(() => {
    getRatedUsers();
  }, []);

  const getRatedUsers = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getRatedUsers,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setRatedUsers(res.data.ratedUsers);
      }
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
        <h1 className="text-slate-500 font-semibold">Rated Users</h1>
        {ratedUsers.length ? (
          ratedUsers.map((user) => (
            <div className="flex items-center mt-4 justify-between" key={user.user?._id}>
              <img
                className="h-8 w-8 rounded-full mr-2"
                src={`http://localhost:5000/userProfile/${user?.user?.profile}`}
                alt=""
              />
                <small className="text-black font-semibold uppercase">
                  {user.user?.name}
                </small>{" "}
                <StarRating rating={user?.rating}/>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500">No rated users found!..</p>
        )}
      </div>
    </Modal>
  );
}

export default RatedUsersModal;
