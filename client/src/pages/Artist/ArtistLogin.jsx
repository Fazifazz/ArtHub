import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ServerVariables } from "../../util/ServerVariables";
import MyButton from "../../components/MyButton";
import { useDispatch } from "react-redux";
import { ArtistLoginThunk } from "../../redux/ArtistAuthSlice";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import eye icons

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const ArtistLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(ArtistLoginThunk(values));
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">ARTIST LOGIN</h2>

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
          <div className="mb-4 relative"> {/* Added relative class */}
            <label className="block text-sm font-semibold text-gray-600">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="text-black w-full p-2 border border-gray-300 rounded pr-10" 
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-2 mt-6" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FiEyeOff color="black" />
              ) : (
                <FiEye color="black" />
              )}
            </button>
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

        <p className="text-sm">
          Don't have an account?
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(ServerVariables.ArtistRegister)}
          >
            Sign up
          </a>
        </p>
        <a
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate(ServerVariables.artistVerifyEmail)}
        >
          Forgot Password?
        </a>
        <div className="text-center">
          <a
            className="text-yellow-300 cursor-pointer"
            onClick={() => navigate(ServerVariables.Landing)}
          >
            Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArtistLogin;
