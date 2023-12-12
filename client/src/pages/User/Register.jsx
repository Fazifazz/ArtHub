import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ServerVariables } from "../../util/ServerVariables";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .min(10, "mobile number must be 10 letters")
    .max(10, "mobile number must be 10 letters")
    .required("mobile number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
  Cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("confirm password is required"),
});

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      dispatch(showLoading());
      const registerData = values;

      userRequest({
        url: apiEndPoints.postRegisterData,
        method: "post",
        data: registerData,
      })
        .then((response) => {
          dispatch(hideLoading());
          if (response.data.success) {
            navigate(ServerVariables.verifyOtp, {
              state: { email: response.data.email },
            });
          } else {
            setError(response.data.error);
            setTimeout(() => {
              setError("");
            }, 2000);
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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">USER REGISTER</h2>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : ""}
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Name:</label>
            <input
              type="name"
              name="name"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.name && formik.touched.name && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.name}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Mobile:</label>
            <input
              type="mobile"
              name="mobile"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.mobile && formik.touched.mobile && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.mobile}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Email:</label>
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
            <label className="block text-sm font-semibold">Password:</label>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Confirm Password:
            </label>
            <input
              type="password"
              name="Cpassword"
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={formik.values.Cpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.errors.Cpassword && formik.touched.Cpassword && (
            <p className="text-sm font-bold text-red-600">
              {formik.errors.Cpassword}
            </p>
          )}
          <div className="flex items-center justify-center">
            <button className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-green-600">
              Register
            </button>
          </div>
        </form>

        <p className="text-sm">
          Already have an account?
          <a
            className="text-blue-500"
            onClick={() => navigate(ServerVariables.Login)}
          >
            Login
          </a>
        </p>
        <a className="text-blue-500">Forgot Password?</a>
      </div>
    </div>
  );
}

export default Register;
