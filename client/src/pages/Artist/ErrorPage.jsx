import React from "react";
import Navbar from "../../components/Navbar";
import MyButton from "../../components/MyButton";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

const PaymentFailPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-700">
            Sorry, there was an issue processing your payment.
          </p>
          <MyButton
            text="Back To Home"
            onClick={() => navigate(ServerVariables.plansAvailable)}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentFailPage;
