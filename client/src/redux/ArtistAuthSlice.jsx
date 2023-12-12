import { createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../util/api";
import { ArtistRequest } from "../Helper/instance";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "./AlertSlice";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  message: "",
  artist: JSON.parse(localStorage.getItem("artistInfo")) || {},
  token: JSON.parse(localStorage.getItem("artistToken")) || null,
};

export const ArtistAuthSlice = createSlice({
  name: "ArtistAuth",
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
      localStorage.setItem("artistInfo", JSON.stringify(action.payload.artist));
      localStorage.setItem("artistToken", JSON.stringify(action.payload.token));
      state.token = action.payload.token;
      state.message = action.payload.success;
    },

    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload.error;
    },
    logoutArtist: (state, action) => {
      localStorage.removeItem("artistInfo");
      localStorage.removeItem("artistToken");
      state.token = null;
      state.artist = {};
    },
  },
});

export const ArtistLoginThunk = (data) => async (dispatch) => {
  try {
    dispatch(showLoading())
    dispatch(loginPending());
    const res = await ArtistRequest({
      url: apiEndPoints.postArtistVerifyLogin,
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

export const { loginPending, loginSuccess, loginReject, logoutArtist } =
  ArtistAuthSlice.actions;
export default ArtistAuthSlice.reducer;
