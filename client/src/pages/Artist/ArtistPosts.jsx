import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon, HeartIcon } from "@heroicons/react/24/outline";
import ArtistNavbar from "../../components/ArtistNav";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../util/ServerVariables";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { ArtistRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../util/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaComment } from "react-icons/fa";
import Modal from "react-modal";
import CommentModal from "../../components/CommentModal";

const PostCard = ({ post, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-800">
            {post.likes?.length} Likes{" "}
            <HeartIcon className="w-6 h-6 text-red-600 fill-red-600" />
          </p>
          <p className="text-gray-800 cursor-pointer" onClick={openModal}>
            {post.comments?.length} Comments <FaComment size={20} />
          </p>
          <button
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
            onClick={() => onDelete(post._id)}
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        {/* Use the CommentModal component */}
        <CommentModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          Comments={post.comments}
          post={post}
          // Pass any additional props or states as needed
        />
      </Modal>
    </div>
  );
};

const PostList = ({ posts, onDelete }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

const NewPostButton = ({ onClick }) => {
  return (
    <button
      className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-full hover:bg-blue-700"
      onClick={onClick}
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
};

const PostPage = () => {
  const [posts, setPosts] = useState([]);

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: `Delete post`,
      text: "Are you sure to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());
      ArtistRequest({
        url: apiEndPoints.deletePost,
        method: "post",
        data: { id: postId },
      })
        .then((res) => {
          dispatch(hideLoading());
          if (res.data.success) {
            toast.success(res.data.success);
            getPosts();
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          console.log(err.message);
          toast.error("something went wrong");
        });
    }
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.getMyPosts,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setPosts(res.data.posts);
      } else {
        toast.error(res.data.error);
      }
    });
  };
  return (
    <>
      <ArtistNavbar />
      <div className="min-h-screen bg-gray-100 p-8">
        {posts.length ? (
          <h2 className="uppercase text-center text-slate-500 font-bold mb-12 text-3xl">
            My posts
          </h2>
        ) : (
          <>
            <p className="text-center text-slate-500 font-bold mb-12 text-3xl">
              No posts uploaded yet..pls upload some posts
            </p>
            <p className=" text-slate-500 text-center font-light">
              click the Plus button(+) to add a post
            </p>
            <NewPostButton onClick={() => navigate(ServerVariables.addPost)} />
          </>
        )}
        {posts.length > 0 && <PostList posts={posts} onDelete={handleDelete} />}
        {posts.length > 0 && (
          <NewPostButton onClick={() => navigate(ServerVariables.addPost)} />
        )}
      </div>
    </>
  );
};

export default PostPage;
