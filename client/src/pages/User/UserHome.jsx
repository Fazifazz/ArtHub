import React from "react";
import MyButton from "../../components/MyButton";

import Navbar from "../../components/Navbar";
import { useDispatch } from "react-redux";

function UserHome() {
  const dispatch = useDispatch();

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
          <h2 className="text-2xl font-bold mb-6">Welcome User</h2>
        </div>
      </div>
    </>
  );
}

export default UserHome;
