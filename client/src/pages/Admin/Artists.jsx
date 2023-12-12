// Dashboard.jsx
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNav";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getArtists();
  }, []);

  const getArtists = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.showArtists,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setArtists(res.data.artists);
        }
      })
      .catch((error) => {
        console.log(error.message);
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
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getArtists();
        } else {
          toast.error(res.data.error);
        }
      }).catch((err) => {
        dispatch(hideLoading());
        toast.error("something went wrong");
        console.log(err.message);
      });
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Artists
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
                    <th className="border-b p-4">profile</th>
                    <th className="border-b p-4">Name</th>
                    <th className="border-b p-4">Mobile</th>
                    <th className="border-b p-4">Email</th>
                    <th className="border-b p-4">Verified</th>
                    <th className="border-b p-4">Plan status</th>
                    <th className="border-b p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artists.length ? (
                    artists
                      .filter((item) => {
                        return searchTerm.toLowerCase() === ""
                          ? item
                          : item.name.toLowerCase().includes(searchTerm) ||
                              item.mobile.toString().includes(searchTerm) ||
                              item.email.toLowerCase().includes(searchTerm);
                      })
                      .map((artist, index) => {
                        return (
                          <tr key={artist._id}>
                            <td className="border-b p-4 text-center">
                              {index + 1}
                            </td>
                            <td className="border-b p-4 text-center">
                              <div
                                className="h-10 w-10 rounded-full"
                                alt="image"
                              >
                                <UserCircleIcon />
                              </div>
                            </td>
                            <td className="border-b p-4 text-center">
                              {artist.name}
                            </td>
                            <td className="border-b p-4 text-center">
                              {artist.mobile}
                            </td>
                            <td className="border-b p-4 text-center">
                              {artist.email}
                            </td>
                            <td className="border-b p-4 text-center">
                              {artist.isVerified?'yes':'No'}
                            </td>
                            <td className="border-b p-4 text-center">
                              {artist.planStatus}
                            </td>
                            <td className="text-center">
                              <button
                                className={`${
                                  artist.isBlocked
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } text-white px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10`}
                                onClick={() => {
                                  blockArtist(artist._id);
                                }}
                              >
                                {artist.isBlocked ? "Blocked" : "Block"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <h1 className="text-center text-red-600">
                      No artist found
                    </h1>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Artists;
