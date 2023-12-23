import React, { useEffect, useState } from "react";
import ArtistNavbar from "../../components/ArtistNav";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getPlansAvailable,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        return setPlans(res.data?.plans);
      } else {
        return setPlans([]);
      }
    });
  };

  const handleSubscribe = async (id) => {
    const result = await Swal.fire({
      title: `Proceed To Pay`,
      text: "Are you sure to continue with this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(showLoading());
      ArtistRequest({
        url: apiEndPoints.subscribePlan,
        method: "post",
        data: { planId:id },
      }).then((res)=>{
        dispatch(hideLoading())
        if(res.data.success){
          console.log(res.data.payment)
          console.log(res.data.approvalUrl)
          window.location.href = res.data.approvalUrl;
        }
      })
    }
  };




  return (
    <>
      <ArtistNavbar />
      <div className="min-h-screen bg-black-100 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length ? (
            plans.map((plan, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
                <h3 className="text-yellow-500 mb-4">
                  ₹{plan.amount.toFixed()}
                </h3>
                <p className="mb-4 max-w-10">{plan.description}</p>

                <button
                  className="bg-blue-900 text-white py-2 px-4 rounded-full  hover:bg-yellow-600"
                  onClick={() => handleSubscribe(plan._id)}
                >
                  Subscribe
                </button>
              </div>
            ))
          ) : (
            <div className="text-cente">
              <p className=" text-red-500">No plans Available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlans;
