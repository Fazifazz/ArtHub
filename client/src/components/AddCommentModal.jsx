import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaTelegram } from "react-icons/fa";
import ShowReplies from "./showReplies";
import { API_BASE_URL } from "../config/api";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import toast from "react-hot-toast";

const AddCommentModal = ({
  isOpen,
  closeModal,
  postId,
  addComment,
  artistPosts,
  post,
  getPosts
}) => {
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { user } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      return setSelectedPost(post);
    }
    if (postId && artistPosts) {
      const post = artistPosts.find((post) => post._id === postId);
      setSelectedPost(post);
    }
  }, [postId, artistPosts]);

  useEffect(() => {
    getAllComments();
  }, [comments]);

  const getAllComments = () => {
    userRequest({
      url: apiEndPoints.getComments,
      method: "post",
      data: { postId },
    })
      .then((res) => {
        if (res.data.success) {
          setComments(res.data?.comments);
        } else {
          toast.error("failed to load comments");
        }
      })
      .catch((err) => {
        toast.error("something went wrong!");
        console.log(err.message);
      });
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      addComment(newComment, postId);
      setNewComment("");
    }
  };

  const deleteComment = (postid, commentId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.deleteComment,
      method: "post",
      data: { postid, commentId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setSelectedPost(res.data?.post);
          getAllComments()
          getPosts()
        } else {
          toast.error("failed to delete comment");
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",  
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "500px", // Increased width to accommodate comments
          maxHeight: "500px",
          overflowY: "auto",
        },
      }}
    >
      <div className="mt-2 mb-2">
        {selectedPost && (
          <img
            className="w-full h-42 object-cover"
            src={`${API_BASE_URL}/artistPosts/${selectedPost?.image}`}
            alt={selectedPost?.title}
          />
        )}
        <h2 className="text-slate-400 mb-4">Comments</h2>
        <div className="comments-container">
          {comments?.length ? (
            comments?.map((comment) => (
              <div key={comment._id} className="mb-4">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full mr-2"
                    src={`${API_BASE_URL}/userProfile/${comment?.postedBy?.profile}`}
                    alt=""
                  />
                  <div className="flex-grow">
                    <small className="text-black font-semibold">
                      {comment?.postedBy?.name}
                    </small>{" "}
                    <small>{comment.text}</small>
                    <small className="text-gray-500 ml-2">
                      {new Date(comment?.createdAt).toLocaleString()}
                    </small>
                    {user._id === comment?.postedBy?._id && (
                      <MdOutlineDeleteForever
                        className="fill-red-800 mx-2"
                        onClick={() => deleteComment(postId, comment._id)}
                      />
                    )}
                  </div>
                </div>
                {comment.replies?.length ? (
                  <div className="ml-8 mt-2">
                    <h4 className="text-slate-400 mb-1 ml-6">Artist Replies</h4>
                    {comment.replies.map((reply) => (
                      <ShowReplies
                        key={reply?._id}
                        Reply={reply}
                        Post={
                          post
                            ? post
                            : artistPosts.find((post) => post._id === postId)
                        }
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments</p>
          )}
        </div>
        <div className="flex items-center mt-4">
          <input
            className="placeholder-black-500 w-full p-2 border-2 rounded-full"
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="button" onClick={handleAddComment}>
            <FaTelegram size={30} fill="gray-600" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCommentModal;
