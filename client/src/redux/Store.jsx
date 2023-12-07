import { configureStore } from "@reduxjs/toolkit";

import alertSlice from "./AlertSlice";
import AuthSlice from "./AuthSlice";

const store = configureStore({
  reducer: {
    alerts: alertSlice,
    Auth:AuthSlice,
  },
});

export default store;
