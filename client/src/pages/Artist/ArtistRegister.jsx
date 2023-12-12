import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import { showLoading, hideLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useEffect, useState } from "react";

function ArtistRegister() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      name: "",
      mobile: "",
      email: "",
      password: "",
      // confirmPassword: "",
      experience: "",
      worksDone: "",
      interest: "",
      qualification: "",
      language: "",
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      mobile: Yup.string()
        .min(10, "Mobile number must be 10 digits")
        .max(10, "Mobile number must be 10 digits")
        .required("Mobile number is required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      // confirmPassword: Yup.string()
      //   .oneOf([Yup.ref("password"), null], "Passwords must match")
      //   .required("Required"),
      experience: Yup.string(),
      worksDone: Yup.string(),
      interest: Yup.string(),
      qualification: Yup.string(),
      language: Yup.string().required("Required"),
      category: Yup.string().required("Field is required"),
    }),
    onSubmit: (values) => {
      dispatch(showLoading);
      ArtistRequest({
        url: apiEndPoints.postArtistRegister,
        method: "post",
        data: values,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            navigate(ServerVariables.ArtistVerifyOtp, {
              state: { email: response.data.email },
            });
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
    <div className="flex items-center justify-center">
      <div className="bg-black text-white p-8 rounded shadow-md w-9/12">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6 text-center">ARTIST REGISTER</h2>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="border-b border-gray-900/10 pb-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Name */}
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

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white-200"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="email"
                  autoComplete="email"
                  className={
                    formik.touched.email && formik.errors.email
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
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
                  type="text"
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

              {/* ... (Other fields) */}

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="password"
                  autoComplete="current-password"
                  className={
                    formik.touched.password && formik.errors.password
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-white-200"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="confirmPassword"
                  autoComplete="current-password"
                  className={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div> */}

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
                  className={
                    formik.touched.experience && formik.errors.experience
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.experience && formik.errors.experience && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.experience}
                  </div>
                )}
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
                  value={formik.values.worksDone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id="worksDone"
                  autoComplete="worksDone"
                  placeholder="optional"
                  className={
                    formik.touched.worksDone && formik.errors.worksDone
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.worksDone && formik.errors.worksDone && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.worksDone}
                  </div>
                )}
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
                  className={
                    formik.touched.interest && formik.errors.interest
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.interest && formik.errors.interest && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.interest}
                  </div>
                )}
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
                  className={
                    formik.touched.qualification && formik.errors.qualification
                      ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 border-red-500"
                      : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  }
                />
                {formik.touched.qualification &&
                  formik.errors.qualification && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.qualification}
                    </div>
                  )}
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
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  select your Field
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                    autoComplete="category"
                    placeholder="Select a Field"
                    className={
                      formik.touched.category && formik.errors.category
                        ? "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 border-red-500"
                        : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    }
                  >
                    <option value="" disabled>
                      Select a Field
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
              Register
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?
          <a
            className="text-blue-500"
            onClick={() => navigate(ServerVariables.ArtistLogin)}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default ArtistRegister;
