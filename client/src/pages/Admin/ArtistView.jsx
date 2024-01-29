import React from "react";
import AdminNavbar from "../../components/AdminNav";
import { useLocation, useNavigate } from "react-router-dom";
import MyButton from "../../components/MyButton";
import Swal from "sweetalert2";
import { adminRequest } from "../../Helper/instance";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ServerVariables } from "../../util/ServerVariables";
import { apiEndPoints } from "../../util/api";
import { API_BASE_URL } from "../../config/api";

function ArtistView() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const artist = location.state ? location.state.artist : "";
  const artists = location.state ? location.state.artists : "";


  const handleApprove = async (id) => {
    const artist = artists.find((artist) => artist._id === id);
    const result = await Swal.fire({
      title: `Approve ${artist.name}`,
      text: "Are you sure you want to Approve this artist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(showLoading());
      adminRequest({
        url: apiEndPoints.approveArtist,
        method: "post",
        data: { id: id },
      })
        .then((res) => {
          dispatch(hideLoading());
          if (res.data.success) {
            toast.success(res.data.success);
            navigate(ServerVariables.Artists)
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
  return (
    <>
      <AdminNavbar />
      <div className="bg-gray-100 font-sans min-h-screen w-full  flex flex-row justify-center items-center">
        {/* Increase width and height of the outer div */}
        <div className="card w-96 h-96 mx-auto  bg-gray-300  text-grey-800 shadow-xl hover:shadow">
          <img
            className="w-36 mx-auto rounded-full -mt-20 border-2 border-gray-800 "
            src={`${API_BASE_URL}/artistProfile/${artist?.profile}`}
            alt=""
          />
          <div className="uppercase text-center mt-2 text-3xl font-medium">
            {artist?.name}
          </div>
          <div className="uppercase text-center mt-2 font-semibold text-sm">
            <h2>{artist?.field} Artist</h2>
          </div>
          <div className="text-center font-normal text-lg"></div>
          <div className="px-6 text-center mt-2 font-semibold text-sm">
            <p>
              Interest :{" "}
              {artist?.interest ? `${artist.interest} images` : "Not Given"}{" "}
            </p>
            <p>
              Qualification :{" "}
              {artist?.educationalQualifications
                ? `${artist.educationalQualifications}`
                : "Not Given"}
            </p>
            <p>
              No.of Works done:{" "}
              {artist?.worksDone
                ? `${artist.worksDone} works completed`
                : "Not Given"}
            </p>
            <p>
              Experience(years/month):{" "}
              {artist?.YearOfExperience
                ? `${artist.YearOfExperience}`
                : "Not Given"}
            </p>
            <p>communicationLangauge: {artist?.communicationLangauge}</p>
            <p className="font-semibold">Email: {artist?.email}</p>
            <p className="font-semibold">Mobile: {artist?.mobile}</p>
            <div className="flex flex-col items-center">
              <button
                className="mt-4 bg-green-600 text-white rounded w-20 h-10 mb-2"
                onClick={() => handleApprove(artist?._id)}
              >
                Approve
              </button>
              <button
                className="bg-gray-800 text-white rounded w-11 mb-2"
                onClick={() => window.history.back()}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtistView;
