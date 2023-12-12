import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import MyButton from "../../components/MyButton";
import { useDispatch } from "react-redux";
import { AdminLoginThunk } from "../../redux/AdminAuthSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(AdminLoginThunk(values));
    },
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">ADMIN LOGIN</h2>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email:
            </label>
            <input
              type="email"
              name="email"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.email && formik.touched.email && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.email}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Password:
            </label>
            <input
              type="password"
              name="password"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.password && formik.touched.password && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.password}
            </p>
          )}
          <div className="flex items-center justify-center">
            <MyButton text="Login" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
