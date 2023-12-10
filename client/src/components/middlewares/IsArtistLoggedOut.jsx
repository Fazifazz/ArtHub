import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

function IsArtistLoggedOut() {
  const { token } = useSelector((state) => state.ArtistAuth);
  return token === null ? (
    <Outlet />
  ) : (
    <Navigate to={ServerVariables.ArtistHome} />
  );
}

export default IsArtistLoggedOut;