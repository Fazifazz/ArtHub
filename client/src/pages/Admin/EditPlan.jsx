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
      .catch((err) => {
        dispatch(hideLoading());
        toast.error("something went wrong");
        console.log(err.message);
      });
  };

  const renderDurationOptions = () => {
    switch (name.toLowerCase()) {
      case "weekly":
        return (
          <select
            id="type"
            name="type"
            autoComplete="type"
            onChange={(e) => setType(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            <option value="1 week">1 week</option>
            <option value="2 week">2 week</option>
            <option value="3 week">3 week</option>
            <option value="4 week">4 week</option>
          </select>
        );
      case "monthly":
        return (
          <select
            id="type"
            name="type"
            autoComplete="type-name"
            onChange={(e) => setType(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            {Array.from({ length: 11 }, (_, index) => (
              <option key={index + 1} value={`${index + 1} month`}>
                {index + 1} month
              </option>
            ))}
          </select>
        );
      case "yearly":
        return (
          <select
            id="type"
            name="type"
            autoComplete="type-name"
            onChange={(e) => setType(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            {Array.from({ length: 3 }, (_, index) => (
              <option key={index + 1} value={`${index + 1} year`}>
                {index + 1} year
              </option>
            ))}
          </select>
        );
      default:
        return (
          <select
            disabled
            id="type"
            name="type"
            autoComplete="type-name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
          </select>
        );
    }
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

        <main className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <form>
              <div className="space-y-12 ml-8 mr-8">
                {error ? (
                  <p className="text-sm font-bold text-red-600">{error}</p>
                ) : (
                  ""
                )}
                <div className="border-b border-gray-900/10 pb-12">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="col-span-1">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Plan Type
                      </label>
                      <div className="mt-2">
                        <select
                          id="name"
                          name="name"
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          placeholder="select the plan Type"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value={plan.name}>choose Type</option>
                          <option>weekly</option>
                          <option>monthly</option>
                          <option>Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium leading-6 text-black"
                      >
                        Duration {name && `no of (${name})`}
                      </label>
                      <div className="mt-2">{renderDurationOptions()} </div>
                    </div>

                    <div className="col-span-1">
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
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-x-6">
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
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default EditPlan;
