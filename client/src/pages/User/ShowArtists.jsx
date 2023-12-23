import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest, userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { updateUser } from "../../redux/AuthSlice";
import { updateArtist } from "../../redux/ArtistAuthSlice";
import { ServerVariables } from "../../util/ServerVariables";

const PostCard = ({ artist, onFollow, onUnFollow }) => {
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 relative">
      <img
        className="w-full h-42 object-cover"
        src={`http://localhost:5000/artistProfile/${artist.profile}`}
        onClick={() =>
          navigate(ServerVariables.viewArtistDetails, {
            state: { artist: artist },
          })
        }
        alt="Artist Profile"
      />
      <div className="text-center border-t border-slate-500">
        <h2
          className="uppercase text-xl font-semibold mt-2 mb-2"
          onClick={() =>
            navigate(ServerVariables.viewArtistDetails, {
              state: { artist: artist },
            })
          }
        >
          {artist.name}
        </h2>
        <p className="text-gray-600 mb-2">{artist.field} Artist</p>
        <div className="flex p-4">
          <div className="w-1/2 text-center font-medium">
            <span className="font-gray-800">
              {artist?.followers?.length && artist?.followers?.length} Followers
            </span>
          </div>
          <div className="w-0 border border-gray-800"></div>
          <div className="w-1/2 text-center font-medium">
            <span className="font-gray-800">
              {artist?.posts?.length && artist?.posts?.length} Posts
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center mb-2">
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
    </div>
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getArtists();
  }, []);

  const getArtists = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getAllArtists,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setArtists(res.data.artists);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        {artists.length ? (
          <h2 className="uppercase text-center text-slate-500 font-bold mb-12 text-3xl">
            Artists List
          </h2>
        ) : (
          <>
            <p className="text-center text-slate-500 font-bold mb-12 text-3xl">
              No artists Available
            </p>
          </>
        )}
        {artists.length > 0 && (
          <ArtistsList
            artists={artists}
            onFollow={handleFollow}
            onUnFollow={handleUnFollow}
          />
        )}
      </div>
    </>
  );
};

export default showArtists;
