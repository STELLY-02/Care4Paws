import React from 'react';
import './PostModal.css';
import PostCard from './PostCard';

const PostModal = ({ isOpen, onClose, posts, handleDeletePost }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <div className="posts-container">
          {posts.map((post, index) => (
            <PostCard
            key={index}
            _id={post._id}
            avatarSrc={post.avatarSrc}
            username={post.username}
            displayName={post.displayName}
            imageSrc={post.photo}
            description={post.caption}
            timestamp={post.createdAt}
            date={post.createdAt}
            likes={post.likes}
            userLikes={post.userLikes}
            onDelete={handleDeletePost}
            comments={post.comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostModal;