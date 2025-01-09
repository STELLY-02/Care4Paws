import React, { useState } from 'react';
import './TrendingPost.css';
import PostCard from './PostCard';

const TrendingPost = ({ key, imageSrc, post }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  const handleDeletePost = async (postId) => {
    console.log("Deleting post with ID:", postId);
  };

  return (
    <div className="trending-post">
      <img 
        src={imageSrc} 
        alt={post.description} 
        className="trending-image" 
        onClick={handleOpenModal} 
      />
      {isModalOpen && (
        <div className="trendingmodal" onClick={handleCloseModal}>
          <div className="trendingmodal-content" onClick={(e) => e.stopPropagation()}>
            {/* <button className="trendingclose-button" onClick={handleCloseModal}>X</button> */}
            <PostCard
                key={key}
                _id={post._id}
                avatarSrc={post.avatarSrc}
                username={post.username}
                imageSrc={post.photo}
                description={post.caption}
                timestamp={post.timestamp}
                date={post.date}
                likes={post.likes}
                comments={post.comments}
                userLikes={post.userLikes}
                openModal={() => openModal(post._id)}
                onDelete={handleDeletePost}
                />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingPost;