import { createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../util/api";
import { ArtistRequest, adminRequest } from "../Helper/instance";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  message: "",
  admin: JSON.parse(localStorage.getItem("adminInfo")) || {},
  token: JSON.parse(localStorage.getItem("adminToken")) || null,
};

export const AdminAuthSlice = createSlice({
  name: "AdminAuth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.artist = action.payload.artist;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload.admin));
      localStorage.setItem("adminToken", JSON.stringify(action.payload.token));
      state.token = action.payload.token;
      state.message = action.payload.success;
    },

    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload.error;
    },
    logoutAdmin: (state, action) => {
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminToken");
      state.token = null;
      state.admin = {};
    },
  },
});

export const AdminLoginThunk = (data) => async (dispatch) => {
  try {
    dispatch(loginPending());
    const res = await adminRequest({
      url: apiEndPoints.postAdminLogin,
      method: "post",
      data: data,
    });
    if (res.data.success) {
      dispatch(loginSuccess(res.data));
    } else {
      dispatch(loginReject(res.data));
    }
  } catch (error) {
    dispatch(loginReject(error));
  }
};

export const { loginPending, loginSuccess, loginReject, logoutAdmin } =
  AdminAuthSlice.actions;
export default AdminAuthSlice.reducer;
