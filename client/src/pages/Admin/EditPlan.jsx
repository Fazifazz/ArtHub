import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import toast from "react-hot-toast";

function EditPlan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [description, setDescription] = useState("");
  const location = useLocation();
  const plan = location.state ? location.state.plan : "";
  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setAmount(plan.amount);
      setType(plan.type);
      setDescription(plan.description);
    }
  }, []);

  const handleUpdatePlan = (e) => {
    e.preventDefault();
    if (!name || !type || !amount || !description) {
      setError("All fields should be filled!");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (name.length < 3) {
      setError("Name must be atleast 3 characters");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (description.length < 10) {
      setError("description needs altleast 10 characters");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.updatePlan,
      method: "post",
      data: {
        name: name,
        type: type,
        amount: amount,
        description: description,
        id: plan._id,
      },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          navigate(ServerVariables.Plans);
          toast.success(res.data.success);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              EDIT PLAN
            </h1>
          </div>
        </header>

        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <form>
              <div className="space-y-12 ml-8 mr-8">
                {error ? (
                  <p className="text-sm font-bold text-red-600">{error}</p>
                ) : (
                  ""
                )}
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-full">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Plan Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          id="name"
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Plan Type
                      </label>
                      <div className="mt-2">
                        <select
                          id="type"
                          name="type"
                          onChange={(e) => setType(e.target.value)}
                          autoComplete="type"
                          placeholder="select no.of months"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value={type}>choose No.of months</option>
                          <option>1(monthly)</option>
                          <option>2 months</option>
                          <option>3 months</option>
                          <option>4 months</option>
                          <option>4 months</option>
                          <option>5 months</option>
                          <option>6 months</option>
                          <option>7 months</option>
                          <option>8 months</option>
                          <option>9 months</option>
                          <option>10 months</option>
                          <option>11 months</option>
                          <option>12(yearly)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Amount
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          id="amount"
                          autoComplete="amount"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder=" Write a description for the field"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={() => navigate(ServerVariables.Plans)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleUpdatePlan}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="overflow-x-auto"></div>
          </div>
        </main>
      </div>
    </>
  );
}

export default EditPlan;
