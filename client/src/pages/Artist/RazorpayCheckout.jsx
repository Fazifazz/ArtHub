import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

const RazorpayPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const keyId = location.state ? location.state.key_id : "";
  const artist = location.state ? location.state.artist : "";
  const order = location.state ? location.state.order : "";
  useEffect(() => {
    const options = {
      key: keyId,
      amount: order.amount,
      currency: "INR",
      name: "ArtHub",
      description: "Subscription Payment",
      order_id: order.id,
      handler: function (response) {
        const transactionId = response.razorpay_payment_id;
        const orderId = response.razorpay_order_id;
        const signature = response.razorpay_signature;
        console.log(transactionId);

        // Handle successful payment
        console.log(response);
        console.log("success");

        // // Redirect to a thank you page or handle order confirmation
        window.location.href = `/razorpay/CreateOrder?orderId=${order.id}&transactionId=${transactionId}`;
        // navigate(ServerVariables.successPage)
      },
      "prefill": {
        "name": "Gaurav Kumar", //your customer's name
        "email": "gaurav.kumar@example.com",
        "contact": "9000090000"
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      theme: {
        color: "bg-red-300",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [keyId, order, artist]);

  return (
    <div className="text-center mt-8">
      <h5 className="text-xl font-bold">Payment Processing...</h5>
    </div>
  );
};

export default RazorpayPaymentPage;
