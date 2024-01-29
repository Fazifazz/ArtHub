import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutArtist } from "../../redux/ArtistAuthSlice";
import Modal from "react-modal";
import { motion } from "framer-motion";
import StarRating from "../../components/StarRating";
import FollowersModal from "../../components/FollowersModal";
import ArtistNavbar from "../../components/ArtistNav";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import RatedUsersModal from "../../components/RatedUsersModal";
import { API_BASE_URL } from "../../config/api";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ArtistHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artist } = useSelector((state) => state.ArtistAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const averageRating =
    artist.ratings?.reduce((acc, rating) => acc + rating?.rating, 0) /
      artist?.ratings?.length || 0;

  const openRatingModal = () => {
    setIsRatingModalOpen(true);
  };
  const closeRatingModal = () => {
    setIsRatingModalOpen(false);
  };
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
  const handleLogout = async () => {
    dispatch(logoutArtist());
  };

  return (
    <>
      <ArtistNavbar />

      <h1 className="text-center font-semibold text-slate-500 mt-5 text-3xl">
        My Profile
      </h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words w-full mb-6 shadow-lg rounded-xl mt-20 bg-gray-100"
      >
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img
                  src={`${API_BASE_URL}/artistProfile/${artist?.profile}`}
                  className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]  border-2 border-[#0d0a17]"
                  alt=""
                />
              </motion.div>
            </div>
            <div className="w-full text-center mt-20">
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div
                  className="p-3 text-center cursor-pointer"
                  onClick={() => navigate(ServerVariables.artistPosts)}
                >
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-500">
                    {artist?.posts?.length}
                  </span>
                  <span className="text-sm text-slate-500">Posts</span>
                </div>

                <div
                  className="p-3 text-center cursor-pointer"
                  onClick={openModal}
                >
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-500 ">
                    {artist?.followers?.length}
                  </span>
                  <span className="text-sm text-slate-500">Followers</span>
                </div>
              </div>
            </div>
          </div>
          <span
            className="text-slate-500 cursor-pointer flex justify-center"
            onClick={openRatingModal}
          >
            Rating: <StarRating rating={averageRating} />
          </span>
          <div className="text-center mt-2">
            <h3 className="uppercase text-2xl text-slate-500 font-bold leading-normal mb-1">
              {artist?.name}
            </h3>
            <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
              {artist?.field} Artist
            </div>
          </div>
          <div className="mt-6 py-6 border-t border-slate-500 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="font-medium leading-relaxed text-slate-500 mb-4">
                  INTEREST :{" "}
                  {artist.interest ? `${artist.interest} images` : "Not Given"}
                  {", "}
                  QUALIFICATION :{" "}
                  {artist.educationalQualifications
                    ? `${artist.educationalQualifications}`
                    : "Not Given"}
                  {", "}
                  WORKS DONE(count):{" "}
                  {artist.worksDone
                    ? `${artist.worksDone} works `
                    : "Not Given"}
                  {", "}
                  EXPERIENCE(years/month):{" "}
                  {artist.YearOfExperience
                    ? `${artist.YearOfExperience}`
                    : "Not Given"}
                  {", "}
                  COMMUNICATION LANGUAGE: {artist.communicationLangauge}
                  {", "}
                  EMAIL: {artist.email}
                  {", "}
                  MOBILE NO: {artist.mobile}
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
              <Modal
                isOpen={isRatingModalOpen}
                onRequestClose={closeRatingModal}
                ariaHideApp={false}
                style={customStyles}
              >
                <RatedUsersModal
                  isOpen={openRatingModal}
                  closeModal={closeRatingModal}
                />
              </Modal>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ArtistHome;
