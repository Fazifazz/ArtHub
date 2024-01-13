import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import EditIcon from '../../components/icons/EditIcon';
import Navbar from '../../components/Navbar';
import Modal from "react-modal";
import { ServerVariables } from '../../util/ServerVariables';
import { useNavigate } from 'react-router-dom';
import FollowingsModal from '../../components/Followings';

function UserProfile() {
    const { user } = useSelector((state) => state.Auth);
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
    <Navbar/>
     <div className="bg-gray-100 font-sans min-h-screen w-full flex flex-row justify-center items-center">
    <div className="card w-96 h-96 mx-auto bg-gray-300 text-grey-800 shadow-xl hover:shadow">
          <img
            className="w-36 mx-auto rounded-full -mt-20 border-2 border-gray-800 "
            src={`http://localhost:5000/userProfile/${user?.profile}`}
            alt=""
          />
          <div className="uppercase text-center mt-2 text-3xl font-medium">
            {user.name}
          </div>
          <div className="uppercase text-center mt-2 font-semibold text-sm">
            <h2>Email:  {user?.email}</h2>
          </div>
          <div className="text-center font-normal text-lg"></div>
          <div className="uppercase text-center mt-2 font-semibold text-sm">
            <h2>Mobile: {user?.mobile} </h2>
          </div>
          <div className="text-center font-normal text-lg"></div>
         
          <hr className="mt-8" />
          <div className="flex p-4 justify-center" onClick={openModal}>
            <p className="font-bold text-center cursor-pointer">
              {user?.followings?.length} Following
            </p>
          </div>
          <div className="flex justify-center">
            <p className="font-bold text-center cursor-pointer" onClick={()=>navigate(ServerVariables.editUserProfile)}>
              <EditIcon/>
            </p>
          </div>
          <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
              >
                <FollowingsModal
                  isOpen={isModalOpen}
                  closeModal={closeModal}
                />
              </Modal>
       </div>
      </div>
    </>
  )
}

export default UserProfile
