import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AdminNavbar from "../../components/AdminNav";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import toast from "react-hot-toast";

function Plans() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    getPlans();
  });

  const getPlans = async() => {
    dispatch(showLoading)
    adminRequest({
      url: apiEndPoints.showPlans,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setPlans(res.data.plans);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  };

  const deletePlan = async (id) => {
    const isDeleted = plans.find(
      (plan) => plan._id === id
    )?.isDeleted;
    const result = await Swal.fire({
      title: isDeleted ? "list Confirmation" : "Unlist Confirmation",
      text: isDeleted
        ? "Are you sure you want to list this plan?"
        : "Are you sure you want to unlist this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isDeleted ? "list" : "unlist",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());

      adminRequest({
        url: apiEndPoints.unlistPlan,
        method: "post",
        data: { id: id },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getPlans();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const handleEdit = async(id) => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.editPlan,
      method: "post",
      data: { id: id },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        navigate(ServerVariables.Editplan, {
          state: { plan: res.data.plan },
        });
      }
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              PLANS
            </h1>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border p-2 mr-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />  
            </div>
          </div>
        </header>

        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-100 border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="border-b p-4">Sl No:</th>
                    <th className="border-b p-4">Name</th>
                    <th className="border-b p-4">Type</th>
                    <th className="border-b p-4">Description</th>
                    <th className="border-b p-4">Amount</th>
                    <th className="border-b p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length?plans.filter((item)=>{
                      return searchTerm.toLowerCase()===""?item:item.name.toLowerCase().includes(searchTerm)
                      || item.type.toLowerCase().includes(searchTerm)
                      || item.description.toLowerCase().includes(searchTerm)
                    }).map((plan, index) => {
                    return (
                      <tr key={plan._id}>
                        <td className="border-b p-4 text-center">
                          {index + 1}
                        </td>

                        <td className="border-b p-4 text-center">
                          {plan.name}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.type}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.description}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.amount}
                        </td>
                        <td className="text-center">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-full w-20 md:w-20 h-6 md:h-10"
                            onClick={() => handleEdit(plan._id)}
                          >
                            Edit
                          </button>

                          <button
                            className={`${
                              plan.isDeleted ? "bg-green-500" : "bg-red-500"
                            } text-white px-2 py-1 rounded-full w-20 md:w-20 h-6 md:h-10`}
                            onClick={() => {
                              deletePlan(plan._id);
                            }}
                          >
                            {plan.isDeleted ? "Unlisted" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  }):<h1 className="text-center text-red-600">No plan found</h1>}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Plans;
