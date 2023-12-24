import React, { useEffect, useState } from "react";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";

function SubscriptionHistory() {
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const dispatch = useDispatch();
  // const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const cols = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "date",
      selector: (row) => new Date(row.paymentHistory.date).toLocaleString(),
      sortable: true,
    },

    {
      name: "Artist (mobile)",
      selector: (row) => `${row.name}(${row.mobile})`,
      sortable: true,
    },
    {
      name: "Plan name",
      selector: (row) => row.paymentHistory.planName,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.paymentHistory.price,
      sortable: true,
    },
    {
      name: "plan Expiry date",
      selector: (row) =>
        new Date(row.paymentHistory.expireDate).toLocaleString(),
      sortable: true,
    },
  ];

  useEffect(() => {
    getHistory();
  }, [currentPage]);

  const getHistory = async () => {
    dispatch(showLoading());
    adminRequest({
      url: `${apiEndPoints.getSubscriptionHistory}?page=${currentPage + 1}`,
      // url:apiEndPoints.getSubscriptionHistory,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res?.data?.success) {
        setPaymentsHistory(res.data.payments);
        setPageCount(res.data.totalPages);
      }
    });
  };

  // const handleFilter = (e) => {
  //   const newData = filterData?.filter(
  //     (item) =>
  //       item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //       item.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
  //       item.description.toLowerCase().includes(e.target.value.toLowerCase())
  //   );
  //   setPlans(newData);
  // };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  return (
    <>
      <div className="container mx-auto mt-8">
        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <div className="overflow-x-auto">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <h1 className="uppercase text-slate-600 font-bold mb-4">
                      Subscription History
                    </h1>
                    <DataTable
                      columns={cols}
                      data={paymentsHistory}
                      className="min-w-full"
                    />
                  </div>
                </div>
              </div>
              <ReactPaginate
                previousLabel={
                  <i className="fas fa-chevron-left text-black"></i>
                }
                nextLabel={<i className="fas fa-chevron-right text-black"></i>}
                breakLabel={<span className="hidden sm:inline">...</span>}
                pageCount={pageCount}
                marginPagesDisplayed={3}
                pageRangeDisplayed={2}
                onPageChange={handlePageChange}
                containerClassName="flex justify-center mt-4"
                pageClassName="mx-2"
                pageLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500 text-black"
                previousClassName="mr-2"
                previousLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
                nextClassName="ml-2"
                nextLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
                breakClassName="mx-2"
                breakLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
                activeClassName="text-blue-500 font-bold bg-blue-200"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default SubscriptionHistory;
