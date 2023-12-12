import React from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

function UserHome() {
  const {user} =  useSelector((state)=>state.Auth)
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
          <img
            src="/images/userImages/hub1.png"
            alt="Logo"
            className="h-28 w-44 mx-auto"
          />
          <h2 className="text-2xl font-bold mb-6">Welcome {user.name}</h2>
        </div>
      </div>
    </>
  );
}

export default UserHome;
