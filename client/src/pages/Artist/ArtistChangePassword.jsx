import { useState } from "react";
import { ServerVariables } from "../../util/ServerVariables";
import MyButton from "../../components/MyButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import * as Yup from "yup"; 
import { FiEye, FiEyeOff } from "react-icons/fi"; 

function ArtistChangePassword() {
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state ? location.state.email : "";

  // Password validation schema
  const passwordSchema = Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword(!showCPassword);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    // Validate passwords against schema
    try {
      await passwordSchema.validate(password);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (password !== Cpassword) {
      setError("Password does not match the confirm password");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.artistUpdatePassword,
      method: "post",
      data: { email: email, password: password },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          navigate(ServerVariables.ArtistLogin);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error("Something went wrong");
        console.log(err.message);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        <form>
          <div className="text-center w-full">
            <label className="text-center">New Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Please enter a new password.."
                className="text-black w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff color="black" />
                ) : (
                  <FiEye color="black" />
                )}
              </button>
            </div>
          </div>
          <div className="text-center w-full mb-4">
            <label className="text-center">Confirm Password:</label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                name="Cpassword"
                placeholder="Please confirm your password.."
                className="text-black w-full p-2 border border-gray-300 rounded"
                value={Cpassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2"
                onClick={toggleCPasswordVisibility}
              >
                {showCPassword ? (
                  <FiEyeOff color="black" />
                ) : (
                  <FiEye color="black" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <MyButton text="Update" onClick={updatePassword} />
          </div>
        </form>

        <a
          className="text-blue-500 text-center"
          onClick={() => navigate(ServerVariables.ArtistLogin)}
        >
          Cancel
        </a>
      </div>
    </div>
  );
}

export default ArtistChangePassword;
