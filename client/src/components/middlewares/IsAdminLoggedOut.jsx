import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

function IsAdminLoggedOut() {
  const { token } = useSelector((state) => state.AdminAuth);
  return token === null ? (
    <Outlet />
  ) : (
    <Navigate to={ServerVariables.AdminDashboard} />
  );
}

export default IsAdminLoggedOut;