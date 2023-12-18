import React, { useEffect, useRef, useState } from "react";
import ArtistNavbar from "../../components/ArtistNav";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ServerVariables } from "../../util/ServerVariables";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updateArtist } from "../../redux/ArtistAuthSlice";

function EditArtistProfile() {
  const [categories, setCategories] = useState([]);
  const { artist } = useSelector((state) => state.ArtistAuth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    ArtistRequest({
      url: apiEndPoints.getCategories,
      method: "get",
    }).then((res) => {
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: artist.name,
      mobile: artist.mobile,
      experience: artist.YearOfExperience ? artist.YearOfExperience : 0,
      worksDone: artist.worksDone ? artist.worksDone : 0,
      interest: artist.interest ? artist.interest : "Not Given",
      qualification: artist.educationalQualifications
        ? artist.educationalQualifications
        : "Not Given",
      language: artist.communicationLangauge,
      category: artist.category,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is Required"),
      mobile: Yup.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      experience: Yup.string(),
      worksDone: Yup.string(),
      interest: Yup.string(),
      qualification: Yup.string(),
      language: Yup.string().required("Required"),
      category: Yup.string().required("Field is required"),
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
          data.append("experience", formik.values.experience);
          data.append("worksDone", formik.values.worksDone);
          data.append("interest", formik.values.interest);
          data.append("qualification", formik.values.qualification);
          data.append("language", formik.values.language);
          data.append("category", formik.values.category);
        } else {
          setError("Only images are allowed to upload");
          setTimeout(() => {
            setError("");
          }, 2000);
          return;
        }
      }

      dispatch(showLoading());
      ArtistRequest({
        url: apiEndPoints.editArtistProfile,
        method: "post",
        data: data ? data : values,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            dispatch(updateArtist(response.data.updatedArtist));
            navigate(ServerVariables.artistProfile);
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
      <ArtistNavbar />
      <div className="flex items-center  mt-11 justify-center">
        <div className="bg-gray-100  text-gray-800 p-8 rounded shadow-md w-9/12 text-center">
          <h2 className="text-2xl font-bold mb-6 text-center">
            UPDATE PROFILE
          </h2>
          {error && <p className="text-red-600">{error}</p>}
          <img
            className="w-44 h-44 mx-auto rounded-full border-2 border-gray-800 "
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : `http://localhost:5000/artistProfile/${artist.profile}`
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

                {/* Years of Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="experience"
                    autoComplete="experience"
                    placeholder="optional"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>
                {/* Works Done */}
                <div>
                  <label
                    htmlFor="worksDone"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Works Done
                  </label>
                  <input
                    type="text"
                    name="worksDone"
                    value={formik.values?.worksDone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="worksDone"
                    autoComplete="worksDone"
                    placeholder="optional"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>

                {/* Interest */}
                <div>
                  <label
                    htmlFor="interest"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Interest
                  </label>
                  <input
                    type="text"
                    name="interest"
                    value={formik.values.interest}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="interest"
                    placeholder="optional"
                    autoComplete="interest"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>

                {/* Educational Qualification */}
                <div>
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Educational Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="qualification"
                    autoComplete="qualification"
                    placeholder="optional"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  />
                </div>

                {/* Preferred Language */}
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium leading-6 text-white-200"
                  >
                    Preferred Language
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formik.values.language}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    id="language"
                    autoComplete="language"
                    className={
                      formik.touched.language && formik.errors.language
                        ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                        : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    }
                  />
                  {formik.touched.language && formik.errors.language && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.language}
                    </div>
                  )}
                </div>

                {/* Field */}
                <div className="sm:col-span-1">
                  <div className="mt-2">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium leading-6 text-white-200"
                    >
                      Your Field
                    </label>
                    <select
                      id="category"
                      name="category"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.category}
                      autoComplete="category"
                      placeholder="Select your Field"
                      className={
                        formik.touched.category && formik.errors.category
                          ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-red-500"
                          : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      }
                    >
                      <option value="" disabled>
                        Select your Field
                      </option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.category}
                      </div>
                    )}
                  </div>
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
              <button className="bg-gray-800 hover:bg-blue-700 ml-2 mt-3 w-26 text-white font-bold py-2 px-4 rounded" onClick={()=>navigate(ServerVariables.artistProfile)}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditArtistProfile;
