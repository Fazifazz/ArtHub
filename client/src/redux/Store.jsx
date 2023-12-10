import { configureStore } from "@reduxjs/toolkit";

import alertSlice from "./AlertSlice";
import AuthSlice from "./AuthSlice";
import ArtistAuthSlice from "./ArtistAuthSlice";
import AdminAuthSlice from "./AdminAuthSlice";

const store = configureStore({
  reducer: {
    alerts: alertSlice,
    Auth:AuthSlice,
    ArtistAuth:ArtistAuthSlice,
    AdminAuth:AdminAuthSlice,
  },
});

export default store;
