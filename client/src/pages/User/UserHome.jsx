import React from "react";
import MyButton from "../../components/MyButton";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import Navbar from "../../components/Navbar";

function UserHome() {
  const navigate = useNavigate();
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

          <MyButton
            text="Logout"
            onClick={() => navigate(ServerVariables.Login)}
          />
        </div>
      </div>
    </>
  );
}

export default UserHome;
