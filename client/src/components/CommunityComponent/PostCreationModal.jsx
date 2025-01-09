import React from 'react';
import './PostCreationModal.css';

const PostCreationModal = ({ isOpen, onClose, campaignTitle, handlePostSubmit, newPost, handlePostChange, handleImageUpload }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <div className="PostCreationForm">
          <h3>Share Something Today!</h3>
          <form onSubmit={handlePostSubmit}>
            <textarea
              name="text"
              placeholder="What's on your mind?"
              value={newPost.text}
              onChange={handlePostChange}
            />
            <div className="form-actions">
              <input id="choose-file" type="file" accept="image/*" onChange={handleImageUpload} />
              <button type="submit">Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreationModal;