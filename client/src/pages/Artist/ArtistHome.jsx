import React, { useEffect } from "react";
import toast from "react-hot-toast";
// import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { logoutArtist } from "../../redux/ArtistAuthSlice";
import MyButton from "../../components/MyButton";

function ArtistHome() {
  const dispatch = useDispatch();
  const {message,artist} = useSelector(state=>state.ArtistAuth)

  useEffect(()=>{
    message.length && toast.success(message)
  })

  const handleLogout = async()=>{
    dispatch(logoutArtist())
  }
  
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
          <img
            src="/images/userImages/hub1.png"
            alt="Logo"
            className="h-28 w-44 mx-auto"
          />
          <h2 className="text-2xl font-bold mb-6">Welcome Artist</h2>
          <MyButton text='Logout' onClick={handleLogout} />
        </div>
      </div>
    </>
  );
}

export default ArtistHome;
