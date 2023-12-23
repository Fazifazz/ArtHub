import React, { useEffect, useState } from "react";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";

function SubscriptionHistory() {
  const [payments, setPayments] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getHistory();
  },[]);

  const getHistory = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.getSubscriptionHistory,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if(res?.data?.success){
        setPayments(res?.data?.payments)
      }
    });
  };
  return (
    <>
      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Payment History</h2>
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* Add more columns as needed */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.transactions[0].amount.total}{" "}
                    {payment.transactions[0].amount.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.state}
                  </td>
                  {/* Add more columns as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SubscriptionHistory;
