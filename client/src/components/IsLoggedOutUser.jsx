import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../util/ServerVariables";

function IsLoggedOutUser() {
  const { token } = useSelector((state) => state.Auth);
  return token === null ? (
    <Outlet />
  ) : (
    <Navigate to={ServerVariables.userHome} />
  );
}

export default IsLoggedOutUser;
