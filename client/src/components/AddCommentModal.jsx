// AddCommentModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTelegram } from 'react-icons/fa';

const AddCommentModal = ({ isOpen, closeModal, comments, addComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', // Increased width to accommodate comments
          maxHeight: '500px',
          overflowY: 'auto',
        },
      }}
    >
      <div className="mt-4 mb-2">
        <h2 className="text-slate-400 mb-4">Add a Comment</h2>
        <div className="comments-container">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-center mb-2">
              <img
                className="h-8 w-8 rounded-full mr-2"
                src={`http://localhost:5000/userProfile/${comment?.postedBy?.profile}`}
                alt=""
              />
              <div className="flex-grow">
                <small className="text-black font-semibold">
                  {comment?.postedBy?.name}
                </small>{' '}
                <small>{comment.text}</small>
              </div>
              <small className='text-gray-500 ml-4'>
                {new Date(comment?.createdAt).toLocaleString()}
              </small>
              {/* You can also include replies here if needed */}
            </div>
          ))}
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
