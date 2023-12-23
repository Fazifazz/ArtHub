import React, { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import { ArtistRequest } from "../Helper/instance";
import { apiEndPoints } from "../util/api";
import toast from "react-hot-toast";

const Reply = ({ Reply, Post, comment }) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState(Reply);
  const [isReply, setIsReply] = useState(true);
  const [post, setPost] = useState(Post);
  console.log("post", post);

  const deleteReplyhandler = (replyId, postId, commentId) => {
    dispatch(showLoading());
    setIsReply(false);
    ArtistRequest({
      url: apiEndPoints.deleteReply,
      method: "post",
      data: { replyId, postId, commentId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setReply(res.data.reply);
          setPost(res.data.post);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("something went wrong!");
      });
  };

  return (
    <footer className="flex justify-between items-center mb-2 ml-8">
      {isReply && (
        <div className="flex items-center mx-2 px-2 rounded-md my-1 py-0.5">
          <p className="inline-flex items-center mr-3 text-sm text-gray-950 ">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={`http://localhost:5000/artistProfile/${post?.postedBy?.profile}`}
              alt="Michael Gough"
            />
            {post?.postedBy?.name}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-500">
            <time pubdate datetime="2022-02-08" title="February 8th, 2022">
              {reply?.reply}
            </time>
          </p>
          <MdOutlineDeleteForever
            className="fill-red-800 mx-2"
            onClick={() =>
              deleteReplyhandler(reply?._id, post._id, comment._id)
            }
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              pubdate
              datetime="2022-02-08"
              title="February 8th, 2022"
            ></time>
          </p>
        </div>
      )}
    </footer>
  );
};

export default Reply;
