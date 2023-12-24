import React, { useState } from "react";
import Modal from "react-modal";
import { FaReply } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { ArtistRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import Reply from "./Reply";

const CommentModal = ({ isOpen, closeModal, Comments, post }) => {
  const [replyText, setReplyText] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [comments, setComments] = useState(Comments);
  const dispatch = useDispatch();

  const handleReplyClick = (commentId) => {
    if (activeReplyCommentId === commentId) {
      // Close the reply input if it's already open
      setActiveReplyCommentId(null);
    } else {
      // Open the reply input for the clicked comment
      setActiveReplyCommentId(commentId);
      setReplyText("");
    }
  };

  const handleReply = async (postId, commentId, reply) => {
    if (!reply.length) {
      return;
    }
    dispatch(showLoading());
    ArtistRequest({
      url: apiEndPoints.replyUserComment,
      method: "post",
      data: { postId, commentId, reply },
    })
      .then((response) => {
        dispatch(hideLoading());
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setActiveReplyCommentId(null);
        setReplyText("");
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "500px",
          maxHeight: "500px",
          overflowY: "auto",
        },
      }}
    >
      <div className="mt-4 mb-2">
        <img
          className="w-full h-42 object-cover"
          src={`http://localhost:5000/artistPosts/${post.image}`}
          alt={post.title}
        />
        <h2 className="text-slate-400 mb-4">Comments</h2>
        <div className="comments-container">
          {comments.length ? (
            comments.map((comment) => (
              <div key={comment._id} className="mb-4">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full mr-2"
                    src={`http://localhost:5000/userProfile/${comment?.postedBy?.profile}`}
                    alt=""
                  />
                  <div className="flex-grow">
                    <small className="text-black font-semibold">
                      {comment?.postedBy?.name}
                    </small>{" "}
                    <small>{comment.text}</small>
                    <button
                      className="ml-6"
                      onClick={() => handleReplyClick(comment._id)}
                    >
                      <FaReply fill="green" />
                    </button>
                  </div>
                  <small className="text-gray-500 ml-4">
                    {new Date(comment?.createdAt).toLocaleString()}
                  </small>
                </div>
                {activeReplyCommentId === comment._id && (
                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      className="border p-2 rounded mr-2 w-full"
                      placeholder="Enter your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      className="bg-green-500 text-white p-1 rounded"
                      onClick={() =>
                        handleReply(post._id, activeReplyCommentId, replyText)
                      }
                    >
                      Reply
                    </button>
                  </div>
                )}
                {comment.replies?.length ? (
                  <p class="inline-flex items-center mx-11 text-sm text-gray-500">
                    Replies
                  </p>
                ):<p class="inline-flex items-center mx-11 text-sm text-gray-500">
                No Replies
              </p>}
                {comment?.replies?.length >= 0 &&
                  comment?.replies?.map((reply, i) => (
                    <Reply
                      key={reply?._id}
                      Reply={reply}
                      Post={post}
                      comment={comment}
                    />
                  ))}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CommentModal;
