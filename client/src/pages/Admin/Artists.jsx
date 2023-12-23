// Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { adminRequest } from "../../Helper/instance";
import "@fortawesome/fontawesome-free/css/all.min.css";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { apiEndPoints } from "../../util/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const cols = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "profile",
      selector: (row) => (
        <img
          className="h-10 w-10 rounded-full"
          src={`http://localhost:5000/artistProfile/${row?.profile}`}
          alt="image"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.isVerified ? "yes" : "No"),
      sortable: true,
    },
    {
      name: "Plan status",
      selector: (row) => row.isSubscribed?'Active':'No Plan',
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) =>
        row.isApproved ? (
          <button
            className={`${
              row.isBlocked ? "bg-red-500" : "bg-green-500"
            } text-white px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10`}
            onClick={() => {
              blockArtist(row._id);
            }}
          >
            {row.isBlocked ? "blocked" : "Block"}
          </button>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded-full w-full md:w-28 sm:w-32 h-11 md:h-10 text-sm md:text-base sm:text-lg"
              onClick={() =>
                navigate(ServerVariables.ViewArtist, {
                  state: { artist: row, artists: artists },
                })
              }
            >
              View
            </button>
          </>
        ),
    },
  ];

  useEffect(() => {
    getArtists();
  }, [currentPage]);

  const getArtists = async () => {
    dispatch(showLoading());
    adminRequest({
      url: `${apiEndPoints.showArtists}?page=${currentPage + 1}`,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setArtists(res.data.artists);
          setFilterData(res.data.artists);
          setPageCount(res.data.totalPages);
          console.log(res.data.totalPages)
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  };
  const blockArtist = async (id) => {
    const isBlocked = artists.find((artist) => artist._id === id)?.isBlocked;
    const result = await Swal.fire({
      title: isBlocked ? "Unblock Confirmation" : "Block Confirmation",
      text: isBlocked
        ? "Are you sure you want to Unblock this artist?"
        : "Are you sure you want to Block this artist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Unblock" : "Block",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());

      adminRequest({
        url: apiEndPoints.blockArtist,
        method: "post",
        data: { id: id },
      })
        .then((res) => {
          dispatch(hideLoading());
          if (res.data.success) {
            toast.success(res.data.success);
            getArtists();
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error("something went wrong");
          console.log(err.message);
        });
    }
  };

  const handleFilter = (e) => {
    const newData = filterData?.filter(
      (item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.mobile.toString().includes(e.target.value)
    );
    setArtists(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-0">
              Artists
            </h1>
            <div className="relative flex items-center mt-4 sm:mt-0">
              <input
                type="text"
                placeholder="Search..."
                className="border p-2 mr-2"
                onChange={handleFilter}
              />
            </div>
          </div>
        </header>
        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {/* Your content */}
            <div className="overflow-x-auto">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <DataTable
                      columns={cols}
                      data={artists}
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
};

export default Artists;
