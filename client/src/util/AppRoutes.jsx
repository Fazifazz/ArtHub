import React from "react";
import { Routes, Route } from "react-router-dom";
import {Toaster} from 'react-hot-toast'
import { ServerVariables } from "./ServerVariables";
import { useSelector } from "react-redux";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/User/LoginPage";
import ArtistLogin from "../pages/Artist/ArtistLogin";
import Register from "../pages/User/Register";
import ArtistRegister from "../pages/Artist/ArtistRegister";
import OtpVerification from "../pages/User/OtpRegister";
import UserHome from "../pages/User/UserHome";
import Dashboard from "../pages/Admin/Dashbord";
import Users from "../pages/Admin/Users";

function AppRoutes() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <div>

      {/* loading spinner ui */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-100 bg-opacity-90">
          <div className="text-blue-500 flex justify-center items-center">
            <svg className="animate-spin h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.292-1.29-8.544-3.544l1.414-1.414z"></path>
            </svg>
          </div>
        </div>
      )}
      
      {/* toast ui */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <Routes>
        <Route path={ServerVariables.Landing} element={<LandingPage />} />

        {/* user routes */}
        <Route path={ServerVariables.Login} element={<LoginPage />} />
        <Route path={ServerVariables.Register} element={<Register />} />
        <Route path={ServerVariables.verifyOtp} element={<OtpVerification />} />
        <Route path={ServerVariables.userHome} element={<UserHome />} />

        {/*artist routes */}
        <Route path={ServerVariables.ArtistLogin} element={<ArtistLogin />} />

        <Route path={ServerVariables.ArtistRegister} element={<ArtistRegister />}/>

          {/* admin routes */}
          <Route path={ServerVariables.AdminDashboard} element={<Dashboard />}/>
          <Route path={ServerVariables.Users} element={<Users />}/>
      </Routes>
    </div>
  );
}

export default AppRoutes;
