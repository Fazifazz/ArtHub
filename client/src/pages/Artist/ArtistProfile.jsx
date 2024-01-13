import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "../../components/icons/EditIcon";
import ArtistNavbar from "../../components/ArtistNav";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import FollowersModal from "../../components/FollowersModal";

const ArtistProfile = () => {
  const { artist } = useSelector((state) => state.ArtistAuth);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <>
      <ArtistNavbar />
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
          </div>
          {/* <hr className="mt-8 bg-gray-800" /> */}
          <div className="w-full mt-8 border border-gray-700"></div>
          <div className="flex p-4">
            <div className="w-1/2 text-center">
              <span className="font-black cursor-pointer"
              onClick={openModal}
              >
                {artist?.followers?.length && artist?.followers?.length}{" "}
                Followers
              </span>
            </div>
            <div className="w-0 border border-gray-800"></div>
            <div className="w-1/2 text-center">
              <span
                className="font-black cursor-pointer"
                onClick={() => navigate(ServerVariables.artistPosts)}
              >
                {artist?.posts?.length && artist?.posts?.length} Posts
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <p
              className="font-bold text-center cursor-pointer"
              onClick={() => navigate(ServerVariables.editArtistProfile)}
            >
              <EditIcon />
            </p>
          </div>
          <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                ariaHideApp={false}
                style={customStyles}
              >
                <FollowersModal
                  isOpen={isModalOpen}
                  closeModal={closeModal}
                  artistId={artist._id}
                />
              </Modal>
        </div>
      </div>
    </>
  );
};

export default ArtistProfile;
