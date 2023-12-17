import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import ArtistProfile from "../Artist/ArtistProfile";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { userRequest } from "../../Helper/instance";
import { ServerVariables } from "../../util/ServerVariables";
import { apiEndPoints } from "../../util/api";

const UserHome = () => {
  const dispatch = useDispatch();
  const [artistPosts, setArtistPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  // const [isLiked,setIsLiked] = useState(false)

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = async () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getAllPosts,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setArtistPosts(res.data.artistPosts);
      }
    });
  };

  const handleLike = (postId, artistId) => {
    userRequest({
      url: apiEndPoints.likePost,
      method: "post",
      data: { id: postId, artistId },
    }).then((res) => {
      if (res.data.success) {
        alert('liked')

        // Fetch updated post data after liking
        getAllPosts();
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full max-w-md">
          {artistPosts.map((post) => (
            <div
              key={post.post._id}
              className="bg-white p-4 my-4 rounded-md shadow-md"
            >
              {/* Artist Profile Section */}
              <div className="flex items-center mb-2 justify-between">
                <img
                  className="h-8 w-8 rounded-full mr-2"
                  src={`http://localhost:5000/profile/${post.profile}`}
                  alt=""
                />
                <p className="uppercase text-xl font-semibold ">
                  {post.artistName}
                </p>
                <button className="bg-gray-800 w-16  rounded text-white">
                  Follow
                </button>
              </div>
              {/* Horizontal Line */}
              <div className="border-t border-gray-300 my-2"></div>

              {/* Post Details Section */}
              <p className="uppercase text-gray-700 mb-4">{post.post.title}</p>
              <p className="text-gray-700 mb-4">{post.post.description}</p>
              {post.post.image && (
                <img
                  src={`http://localhost:5000/artistPosts/${post.post.image}`}
                  alt={`Post by ${post.artistName}`}
                  className="mb-4 rounded-md w-full"
                />
              )}

              {/* Like and Comment Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.post._id, post.artistId)}
                    className="flex items-center space-x-1 text-gray-500"
                  >
                    <FaThumbsUp size={20} />
                    <span>{post.post.likes.count} Likes</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500">
                    <FaComment size={20} />
                    <span>{post.post.comments} Comments</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserHome;
