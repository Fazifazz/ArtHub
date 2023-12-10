// Dashboard.jsx
import React, { useEffect } from "react";
import AdminNavbar from "../../components/AdminNav";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch()
  const {message,admin} = useSelector(state=>state.AdminAuth)
  useEffect(()=>{
    message.length && toast.success(message)
  })

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* content */}
          <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
          <img
            src="/images/userImages/hub1.png"
            alt="Logo"
            className="h-28 w-44 mx-auto"
          />
          <h2 className="text-2xl font-bold mb-6">Welcome Admin</h2>
        </div>
      </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
