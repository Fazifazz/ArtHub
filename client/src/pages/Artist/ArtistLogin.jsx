import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

const ArtistLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-black text-white p-8 rounded shadow-md w-96 text-center">
        <img
          src="/images/userImages/hub1.png"
          alt="Logo"
          className="h-28 w-44 mx-auto"
        />
        <h2 className="text-2xl font-bold mb-6">ARTIST LOGIN</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Password:
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-green-600"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-sm">
          Don't have an account?
          <a className="text-blue-500" onClick={()=>navigate(ServerVariables.ArtistRegister)}>
            Sign up
          </a>
        </p>
        <a href="#" className="text-blue-500">
          Forgot Password?
        </a>
      </div>
    </div>
  );
};

export default ArtistLogin;
