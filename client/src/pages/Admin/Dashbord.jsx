// Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import SubscriptionHistory from "./SubscriptionHistory";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";

const Dashboard = () => {
  // const [paymentsHistory, setPaymentsHistory] = useState([]);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   getHistory();
  // }, []);
  // const getHistory = async () => {
  //   dispatch(showLoading());
  //   adminRequest({
  //     url: apiEndPoints.getSubscriptionHistory,
  //     method: "get",
  //   }).then((res) => {
  //     dispatch(hideLoading());
  //     if (res?.data?.success) {
  //       console.log("payments", res?.data?.payments);
  //       setPaymentsHistory(res?.data?.payments);
  //     }
  //   });
  // };
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
          <SubscriptionHistory />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
