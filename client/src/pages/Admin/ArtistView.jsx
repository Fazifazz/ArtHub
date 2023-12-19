import React from "react";
import AdminNavbar from "../../components/AdminNav";
import { useLocation } from "react-router-dom";
import MyButton from "../../components/MyButton";

function ArtistView() {
  const location = useLocation();
  const artist = location.state ? location.state.artist : "";
  return (
    <>
      <AdminNavbar />
      <div className="bg-gray-100 font-sans min-h-screen w-full  flex flex-row justify-center items-center">
        {/* Increase width and height of the outer div */}
        <div className="card w-96 h-100 mx-auto  bg-gray-300  text-grey-800 shadow-xl hover:shadow">
          <img
            className="w-36 mx-auto rounded-full -mt-20 border-2 border-gray-800 "
            src={`http://localhost:5000/artistProfile/${artist.profile}`}
            alt=""
          />
          <div className="uppercase text-center mt-2 text-3xl font-medium">
            {artist.name}
          </div>
          <div className="uppercase text-center mt-2 font-semibold text-sm">
            <h2>{artist.field} Artist</h2>
          </div>
          <div className="text-center font-normal text-lg"></div>
          <div className="px-6 text-center mt-2 font-semibold text-sm">
            <p>
              Interest :{" "}
              {artist.interest ? `${artist.interest} images` : "Not Given"}{" "}
            </p>
            <p>
              Qualification :{" "}
              {artist.educationalQualifications
                ? `${artist.educationalQualifications}`
                : "Not Given"}
            </p>
            <p>
              No.of Works done:{" "}
              {artist.worksDone
                ? `${artist.worksDone} works completed`
                : "Not Given"}
            </p>
            <p>
              Experience(years/month):{" "}
              {artist.YearOfExperience
                ? `${artist.YearOfExperience}`
                : "Not Given"}
            </p>
            <p>communicationLangauge: {artist.communicationLangauge}</p>
            <p className="font-semibold">Email: {artist.email}</p>
            <p className="font-semibold">Mobile: {artist.mobile}</p>
          <button className="mt-4 bg-gray-800 text-white rounded w-11 mb-2" onClick={()=>window.history.back()}>Back</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ArtistView;
