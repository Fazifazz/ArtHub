import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import toast from "react-hot-toast";
import { FaComment, FaHeart } from "react-icons/fa";
import Modal from "react-modal";
import AddCommentModal from "./AddCommentModal";

const PostCard = ({ post, onLike, onUnLike,getPosts  }) => {
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const AddComment = async (text, postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.comment,
      method: "post",
      data: { text, postId },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        getPosts()
        setIsModalOpen(false)
      }
    });
  };
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 relative">
      <img
        className="w-full h-42 object-cover"
        src={`http://localhost:5000/artistPosts/${post.image}`}
        alt={post.title}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-2">{post.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {post?.likes?.includes(user._id) ? (
              <button
                onClick={() => onUnLike(post._id)}
                className="flex items-center space-x-1 text-red-600"
              >
                <FaHeart size={20} />
                <span>{post?.likes?.length && post?.likes?.length} Likes</span>
              </button>
            ) : (
              <button
                onClick={() => onLike(post._id)}
                className="flex items-center space-x-1 text-gray-500"
              >
                <FaHeart size={20} />
                <span>{post?.likes?.length && post?.likes?.length} Likes</span>
              </button>
            )}
            <button className="flex items-center space-x-1 text-gray-500">
              <FaComment size={20} />
              <span onClick={openModal}>
                {post?.comments?.length && post?.comments?.length} Comments
              </span>
            </button>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          <AddCommentModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            addComment={AddComment}
            post={post}
            postId={post._id}
          />
        </Modal>
      </div>
    </div>
  );
};

const PostList = ({ posts, onLike, onUnLike,getPosts }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={onLike}
          onUnLike={onUnLike}
          getPosts={getPosts}
        />
      ))}
    </div>
  );
};

const ArtistAllPosts = ({ artistId }) => {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getArtistAllposts,
      method: "post",
      data: { artistId },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setPosts(res.data.posts);
      } else {
        toast.error(res.data.error);
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
        getPosts();
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
        getPosts();
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        {posts.length ? (
          <h2 className="uppercase text-center text-slate-500 font-bold mb-12 text-3xl">
            posts
          </h2>
        ) : (
          <>
            <p className="text-center text-slate-500 font-bold mb-12 text-3xl">
              {/* {`No posts for ${} ..`} */}No posts
            </p>
          </>
        )}
        {posts.length > 0 && (
          <PostList
            posts={posts}
            onLike={handleLikePost}
            onUnLike={handleUnLikePost}
            getPosts={getPosts}
          />
        )}
      </div>
    </>
  );
};

export default ArtistAllPosts;