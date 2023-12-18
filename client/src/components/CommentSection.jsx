// CommentSection.jsx
import React, { useState } from 'react';
import { FaComment, FaTelegram } from 'react-icons/fa';

const CommentSection = ({ postId, comments, addComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      addComment(newComment, postId);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4 mb-2">
      <div className="comments-container">
        {comments.length ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex items-center mb-2">
              <img
                className="h-8 w-8 rounded-full mr-2"
                src={`http://localhost:5000/userProfile/${comment?.postedBy?.profile}`}
                alt=""
              />
              <div className="flex-grow">
                <small className="text-black font-semibold">
                  {comment.postedBy.name}
                </small>{' '}
                <small>{comment.text}</small>
              </div>
              <small className='text-gray-500 ml-4'>
                {new Date(comment.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments</p>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center">
          <input
            className="placeholder-black-500 w-full border-2 border-gray-400 rounded"
            type="text"
            placeholder="add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="button" onClick={handleAddComment}>
            <FaTelegram size={30} fill='gray-800' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
