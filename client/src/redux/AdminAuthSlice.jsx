import { createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../util/api";
import { adminRequest } from "../Helper/instance";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "./AlertSlice";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  message: "",
  admin: JSON.parse(localStorage.getItem("adminInfo")) || {},
  token: JSON.parse(localStorage.getItem("adminToken")) || null,
  role:'admin'
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
      state.role = 'admin'
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
    dispatch(showLoading())
    dispatch(loginPending());
    const res = await adminRequest({
      url: apiEndPoints.postAdminLogin,
      method: "post",
      data: data,
    });
    dispatch(hideLoading())
    if (res.data.success) {
      toast.success(res.data.success)
      dispatch(loginSuccess(res.data));
    } else {
      toast.error(res.data.error)
      dispatch(loginReject(res.data));
    }
  } catch (error) {
    dispatch(loginReject(error));
  }
};

export const { loginPending, loginSuccess, loginReject, logoutAdmin } =
  AdminAuthSlice.actions;
export default AdminAuthSlice.reducer;
