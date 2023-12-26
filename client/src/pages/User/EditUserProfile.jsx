import React, {  useState } from "react";
import {  userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ServerVariables } from "../../util/ServerVariables";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { logoutUser, updateUser } from "../../redux/AuthSlice";

function EditUserProfile() {
  const { user } = useSelector((state) => state.Auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: user.name,
      mobile: user.mobile,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is Required"),
      mobile: Yup.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      if (selectedImage) {
        var data = new FormData();
        const newImage = document.getElementById("upload");
        var image = newImage.files[0];
      }

      if (image) {
        if (image.type.startsWith("image")) {
          data.append("profile", image);
          data.append("name", formik.values.name);
          data.append("mobile", formik.values.mobile);
        } else {
          setError("Only images are allowed to upload");
          setTimeout(() => {
            setError("");
          }, 2000);
          return;
        }
      }

      dispatch(showLoading());
      userRequest({
        url: apiEndPoints.updateUserProfile,
        method: "post",
        data: data ? data : values,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            dispatch(updateUser(response.data.updatedUser));
            navigate(ServerVariables.userProfile);
            toast.success(response.data.success);
          } else {
            toast.error(response.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error("something went wrong");
          console.log(err.message);
        });
    },
  });

  return (
    <>
      <Navbar />
      <div className="flex items-center  mt-11 justify-center">
        <div className="bg-gray-100  text-gray-800 p-8 rounded shadow-md  text-center ">
          <h2 className="text-2xl font-bold mb-6 text-center">
            UPDATE PROFILE
          </h2>
          {error && <p className="text-red-600">{error}</p>}
          <img
            className="w-44 h-44 mx-auto rounded-full border-2 border-gray-800 "
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : `http://localhost:5000/userProfile/${user.profile}`
            }
            alt=""
          />

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="flex justify-center mb-6">
              <p className="font-bold text-center">
                <input
                  type="file"
                  id="upload"
                  name="post"
                  accept="image/*"
                  className="mt-1 p-2 w-28 border rounded-md"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </p>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
              <div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="name"
                    autoComplete="name"
                    className={
                      formik.touched.name && formik.errors.name
                        ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                        : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    }
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Mobile
                  </label>
                  <input
                    type="number"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="mobile"
                    autoComplete="mobile"
                    className={
                      formik.touched.mobile && formik.errors.mobile
                        ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                        : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    }
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.mobile}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update
              </button>
              <button className="bg-gray-800 hover:bg-blue-700 ml-2 mt-3 w-26 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate(ServerVariables.userProfile)}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditUserProfile;
