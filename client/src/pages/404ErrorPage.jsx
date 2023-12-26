import React from "react";
import MyButton from "../components/MyButton";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../util/ServerVariables";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            404 Error Page!
          </h1>
          <p className="text-gray-700 mb-2">
            Sorry, this page is not plansAvailable
          </p>
          <MyButton
            text="Back To Home"
            onClick={() => navigate(ServerVariables.Landing)}
          />
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
