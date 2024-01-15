// Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import SubscriptionHistory from "./SubscriptionHistory";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { FaMoneyBill } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState();
  const [artistsCount, setArtistsCount] = useState();
  const [subscribedArtists, setSubscribedArtists] = useState();
  const [dailyRevenue, setDailyRevenue] = useState();
  const [weeklyRevenue, setWeeklyRevenue] = useState();
  const [monthlyRevenue, setMonthlyRevenue] = useState();

  useEffect(() => {
    getDashboardDatas();
  }, []);

  const getDashboardDatas = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.getDashboardDatas,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setUsersCount(res.data?.users);
        setArtistsCount(res.data?.artists);
        setSubscribedArtists(res.data?.subscribedArtists);
        setDailyRevenue(res.data?.dailyAmount);
        setWeeklyRevenue(res.data?.weeklyAmount);
        setMonthlyRevenue(res.data?.monthlyAmount);
      }
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p>Today: {new Date(Date.now()).toLocaleString()}</p>
          </div>
        </header>
        {/* <!-- component --> */}

        <div class="flex flex-wrap bg-gray-500 ">
          <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      {" "}
                      Daily Revenue
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      ₹ {dailyRevenue}.00
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                      <FaMoneyBill />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                  <span class="whitespace-nowrap">
                    From artists subscriptions
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      {" "}
                      Weekly Revenue
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      ₹ {weeklyRevenue}.00
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <FaMoneyBill />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                  <span class="whitespace-nowrap">
                    From artists subscriptions
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      {" "}
                      Monthly Revenue
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      ₹ {monthlyRevenue}.00
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <FaMoneyBill />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                  <span class="whitespace-nowrap">
                    From artists subscriptions
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      {" "}
                      Total Users
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      {usersCount}
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                      <UserCircleIcon />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-blueGray-400 mt-4">
                  <span
                    class="whitespace-nowrap text-blue-500 cursor-pointer underline"
                    onClick={() => navigate(ServerVariables.Users)}
                  >
                    View All Users...{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class=" mt-4 w-full lg:w-6/12 xl:w-4/12 px-5">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      Total Artists
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      {artistsCount}
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                      <UserCircleIcon />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-blueGray-400 mt-4">
                  <span
                    class="whitespace-nowrap text-blue-500 cursor-pointer underline"
                    onClick={() => navigate(ServerVariables.showArtists)}
                  >
                    View All Artists...{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5">
            <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
              <div class="flex-auto p-4">
                <div class="flex flex-wrap">
                  <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                      Subscribed Artists
                    </h5>
                    <span class="font-semibold text-3xl text-blueGray-700">
                      {subscribedArtists}{" "}
                    </span>
                  </div>
                  <div class="relative w-auto pl-4 flex-initial">
                    <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-emerald-500">
                      <UserCircleIcon />
                    </div>
                  </div>
                </div>
                <p class="text-sm text-blueGray-400 mt-4">
                  <span class="whitespace-nowrap text-blue-500 cursor-pointer underline">
                    View All Artists...{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <main>
          <SubscriptionHistory />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
