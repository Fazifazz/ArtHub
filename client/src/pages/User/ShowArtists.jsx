import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { userRequest } from "../../Helper/instance";
import ReactPaginate from "react-paginate";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { updateUser } from "../../redux/AuthSlice";
import { updateArtist } from "../../redux/ArtistAuthSlice";
import { ServerVariables } from "../../util/ServerVariables";
import StarRating from "../../components/StarRating";
import { motion } from 'framer-motion';
import { API_BASE_URL } from "../../config/api";


const PostCard = ({ artist, onFollow, onUnFollow }) => {
  const { user } = useSelector((state) => state.Auth);
  const averageRating = artist.ratings?.reduce((acc,rating)=>acc + rating?.rating,0)/artist?.ratings?.length || 0
  const navigate = useNavigate();
  return (
    <motion.div 
    initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{scale:1.1}}
    className="bg-white shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 relative">
      <img
        className="w-full h-42 object-cover"
        src={`${API_BASE_URL}/artistProfile/${artist.profile}`}
        alt="Artist Profile"
        onClick={() =>
          navigate(ServerVariables.viewArtistDetails, {
            state: { artist: artist },
          })
        }
      />
      <div className="text-center border-t border-slate-500">
        <h2
          className="uppercase text-xl font-semibold mt-2 mb-2 cursor-pointer"
          onClick={() =>
            navigate(ServerVariables.viewArtistDetails, {
              state: { artist: artist },
            })
          }
        >
          {artist.name}
        </h2>
        <p className="text-gray-600 mb-2">{artist.field} Artist</p>
            <span className="text-gray-800 cursor-pointer flex justify-center">
              Rating: <StarRating rating={averageRating} />
            </span>
        <div className="flex p-4">
          <div className="w-1/2 text-center font-medium">
            <span className="font-gray-800 cursor-pointer">
              {artist?.followers?.length && artist?.followers?.length} Followers
            </span>
          </div>
          <div className="w-0 border border-gray-800"></div>
          <div className="w-1/2 text-center font-medium">
            <span className="font-gray-800 cursor-pointer">
              {artist?.posts?.length && artist?.posts?.length} Posts
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center mb-2 cursor-pointer">
          {user?.followings?.includes(artist._id) ? (
            <button
              className="bg-gray-500 w-24 text-center text-white p-2 rounded-full hover:bg-gray-600"
              onClick={() => onUnFollow(artist._id)}
            >
              Following
            </button>
          ) : (
            <button
              className="bg-gray-800 w-24 text-center text-white p-2 rounded-full hover:bg-gray-950"
              onClick={() => onFollow(artist._id)}
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ArtistsList = ({ artists, onFollow, onUnFollow }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {artists.map((artist) => (
        <PostCard
          key={artist._id}
          artist={artist}
          onFollow={onFollow}
          onUnFollow={onUnFollow}
        />
      ))}
    </div>
  );
};

const showArtists = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getArtists();
  }, [currentPage]);

  const getArtists = async () => {
    dispatch(showLoading());
    userRequest({
      url: `${apiEndPoints.getAllArtists}?page=${currentPage + 1}`,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setPageCount(res?.data?.totalPages);
        setArtists(res.data.artists);
        setFilterData(res.data.artists);
      } else {
        toast.error(res.data.error);
      }
    });
  };

  const handleFollow = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.followArtist,
      method: "post",
      data: { artistId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          dispatch(updateUser(res.data.updatedUser));
          dispatch(updateArtist(res.data.updatedArtist));
          getArtists();
          return;
        }
        return toast.error(res.data.error);
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("Something went wrong");
      });
  };
  const handleUnFollow = async (artistId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.unFollowArtist,
      method: "post",
      data: { artistId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          dispatch(updateUser(res.data.updatedUser));
          dispatch(updateArtist(res.data.updatedArtist));
          getArtists();
          return;
        }
        return toast.error(res.data.error);
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("Something went wrong");
      });
  };

  const handleFilter = (e) => {
    const newData = filterData?.filter(
      (item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.field.toLowerCase().includes(e.target.value.toLowerCase()) 
    );
    setArtists(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        {artists.length ? (
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <h2 className="uppercase text-center sm:text-left text-slate-500 font-bold mb-4 sm:mb-0 text-3xl">
              Artists List
            </h2>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search artist name/field.."
                className="border p-2 w-full sm:w-auto"
                onChange={handleFilter}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-500 font-bold mb-12 text-3xl">
            No artists Available
          </p>
        )}
        {artists.length > 0 && (
          <ArtistsList
            artists={artists}
            onFollow={handleFollow}
            onUnFollow={handleUnFollow}
          />
        )}
        {artists.length > 0 && (
          <ReactPaginate
            previousLabel={<i className="fas fa-chevron-left text-black"></i>}
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
        )}
      </div>
    </>
  );
};


export default showArtists;
