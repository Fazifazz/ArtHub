import  { useState } from "react";
import { ServerVariables } from "../../util/ServerVariables";
import MyButton from "../../components/MyButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";

function ArtistVerifyEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleArtistVerifyEmail = async (e) => {
    e.preventDefault();
    dispatch(showLoading());

    if (!email) {
      setError('Email is required')
      return setTimeout(()=>{
          setError('')
      },2000)
    }
    ArtistRequest({
      url: apiEndPoints.forgetArtistVerifyEmail,
      method: "post",
      data: { email: email },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          navigate(ServerVariables.forgetArtistOtp, {
            state: { email: res.data.email },
          });
          toast.success(res.data.success);
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
        <h2 className="text-2xl font-bold mb-6">Artist Email Verification</h2>
        {error ? <p className="text-sm font-bold text-red-600">{error}</p> : ""}
        <form>
          <div className="flex justify-between  mb-4">
            <div className="text-center w-full">
              <input
                type="text"
                name="email"
                placeholder="please enter your email.."
                className="text-black w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <MyButton text="Verify Email" onClick={handleArtistVerifyEmail} />
          </div>
        </form>

        <p className="text-sm">
          Back to
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

export default ArtistVerifyEmail;
