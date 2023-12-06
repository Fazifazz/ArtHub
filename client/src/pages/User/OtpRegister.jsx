import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import MyButton from "../../components/MyButton";
import { ServerVariables } from "../../util/ServerVariables";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { hideLoading, showLoading } from "../../redux/AlertSlice";

const OtpVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state ? location.state.email : "";

  // Assuming you have a state for OTP digits
  const initialValues = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      dispatch(showLoading());
      // Handle OTP submission
      const otp = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`;

      userRequest({
        url: apiEndPoints.postVerifyOtp,
        method: "post",
        data: { otp: otp, email: email },
      }).then((res) => {
        if (res.data.success) {
          dispatch(hideLoading());
          toast.success(res.data.success);
          navigate(ServerVariables.Login);
        } else {
          dispatch(hideLoading())
          toast.error(res.data.error);
        }
      });
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">OTP Verification</h2>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex justify-between  mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-1/4 mr-2">
                <input
                  type="text"
                  name={`digit${index + 1}`}
                  className="text-black w-full p-2 border border-gray-300 rounded"
                  maxLength="1"
                  value={formik.values[`digit${index + 1}`]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <MyButton text="Verify Otp" />
          </div>
        </form>

        <p className="text-sm mt-2">
          Did not receive the OTP?
          <a href="#" className="text-blue-500">
            Resend OTP
          </a>
        </p>
        <p className="text-sm">
          Back to
          <a
            className="text-blue-500"
            onClick={() => navigate(ServerVariables.Login)}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
