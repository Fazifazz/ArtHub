import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

function IsLoggedOutUser() {
  const { token} = useSelector((state) => state.Auth);

  // Check if the token exists and user is not blocked
  const isUserAuthenticated = token
  return !isUserAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ServerVariables.userHome} />
  );
}

export default IsLoggedOutUser;
