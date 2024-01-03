import { useState } from "react";
import { ServerVariables } from "../../util/ServerVariables";
import MyButton from "../../components/MyButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";

function ArtistChangePassword() {
  const [password, setPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state ? location.state.email : "";

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!password || !Cpassword) {
      setError("All fields are required");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (password.length < 6) {
      setError("password must have atleast 6 letters");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (password !== Cpassword) {
      setError("password not match confirm password");
      return setTimeout(() => {
        setError("");
      }, 2000);
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
        toast.error("something went wrong");
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
        <h2 className="text-2xl font-bold mb-6">Set new Password</h2>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : ""}
        <form>
          <div className="text-center w-full">
            <label className="text-center">New password:</label>
            <input
              type="text"
              name="email"
              placeholder="please enter new password.."
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-center w-full mb-4">
            <label className="text-center">Confirm password:</label>
            <input
              type="text"
              name="email"
              placeholder="please confirm your password.."
              className="text-black w-full p-2 border border-gray-300 rounded"
              value={Cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
            <MyButton text="Update" onClick={updatePassword} />
          </div>
        </form>

        <a
          className="text-blue-500 text-center"
          onClick={() => navigate(ServerVariables.ArtistLogin)}
        >
          cancel
        </a>
      </div>
    </div>
  );
}

export default ArtistChangePassword;
