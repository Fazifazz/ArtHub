import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaComment } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { userRequest } from "../../Helper/instance";
import { ServerVariables } from "../../util/ServerVariables";
import { apiEndPoints } from "../../util/api";
import CommentSection from "../../components/CommentSection";

const UserHome = () => {
  const dispatch = useDispatch();
  const [artistPosts, setArtistPosts] = useState([]);
  const { user } = useSelector((state) => state.Auth);
  const [showComments, setShowComments] = useState(false);
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
      if (res.data?.success) {
        setArtistPosts(res.data?.artistPosts);
        console.log(artistPosts);
      }
    });
  };

  const handleLikePost = (postId) => {
    userRequest({
      url: apiEndPoints.likePost,
      method: "post",
      data: { id: postId },
    }).then((res) => {
      if (res.data?.success) {
        getAllPosts();
      }
    });
  };
  const handleUnLikePost = (postId) => {
    userRequest({
      url: apiEndPoints.unLikePost,
      method: "post",
      data: { id: postId },
    }).then((res) => {
      if (res.data?.success) {
        getAllPosts();
      }
    });
  };

  const addComment = async (text, postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.comment,
      method: "post",
      data: { text, postId },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        getAllPosts();
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="w-full max-w-md">
          {artistPosts.length
            ? artistPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-200  p-4 my-4 rounded-md shadow-md"
                >
                  {/* Artist Profile Section */}
                  <div className="flex items-center mb-2 justify-between">
                    <img
                      className="h-8 w-8 rounded-full mr-2"
                      src={`http://localhost:5000/artistProfile/${post?.postedBy?.profile}`}
                      alt=""
                    />
                    <p className="uppercase text-xl font-semibold ">
                      {post?.postedBy?.name}
                    </p>
                    <button className="bg-gray-800 w-16  rounded text-white">
                      Follow
                    </button>
                  </div>
                  {/* Horizontal Line */}
                  <div className="border-t border-gray-300 my-2"></div>

                  {/* Post Details Section */}
                  <p className="uppercase text-gray-700 mb-4">{post?.title}</p>
                  <p className="text-gray-700 mb-4">{post?.description}</p>
                  {post.image && (
                    <img
                      src={`http://localhost:5000/artistPosts/${post.image}`}
                      alt={`Post by ${post?.postedBy?.name}`}
                      className="mb-4 rounded-md w-full"
                    />
                  )}

                  {/* Like and Comment Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {post.likes.includes(user._id) ? (
                        <button
                          onClick={() => handleUnLikePost(post._id)}
                          className="flex items-center space-x-1 text-blue-500"
                        >
                          <FaThumbsUp size={20} />
                          <span>
                            {post?.likes?.length ? post?.likes?.length : 0}{" "}
                            Likes
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className="flex items-center space-x-1 text-gray-500"
                        >
                          <FaThumbsUp size={20} />
                          <span>
                            {post?.likes?.length ? post?.likes?.length : 0}{" "}
                            Likes
                          </span>
                        </button>
                      )}
                      <button
                        className="flex items-center space-x-1 text-gray-500"
                        onClick={() => setShowComments(!showComments)}
                      >
                        <FaComment size={20} />
                        <span onClick={() => setShowComments(true)}>
                          {post?.comments?.length ? post?.comments?.length : 0}{" "}
                          Comments
                        </span>
                      </button>
                    </div>
                  </div>
                  {showComments && (
                    <CommentSection
                      postId={post._id}
                      comments={post.comments}
                      addComment={addComment}
                    />
                  )}
                </div>
              ))
            : "No posts available"}
        </div>
      </div>
    </>
  );
};

export default UserHome;