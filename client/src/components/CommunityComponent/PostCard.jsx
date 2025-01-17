import React, { useState, useEffect } from 'react';
import './PostCard.css';
import { FaRegCommentDots } from "react-icons/fa6";
import { LuDog } from "react-icons/lu";
import { likePost, unlikePost, fetchCommentCount, deletePost } from '../../api';
import CommentModal from './CommentModal';
import UserProfileLink from './UserProfileLink';

export const PostCard = ({ 
  _id,
  postedBy,
  avatarSrc, 
  username, 
  imageSrc, 
  description, 
  timestamp, 
  date,
  likes,
  userLikes,
  onDelete,
}) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    setIsLiked(userLikes.includes(currentUserId));
  }, [userLikes]);

  useEffect(() => {
    const getCommentCount = async () => {
      try {
        const count = await fetchCommentCount(_id);
        setCommentCount(count);
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    getCommentCount();
  }, [_id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateCommentCount = async () => {
    try {
      const count = await fetchCommentCount(_id);
      setCommentCount(count);
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };
const handleLikeClick = async () => {
    try {
      if (isLiked) {
        // User is unliking the post
        setIsLiked(false);
        setLikeCount(prevCount => prevCount - 1);
        await unlikePost(_id); // Call the API to unlike the post
      } else {
        // User is liking the post
        setIsLiked(true);
        setLikeCount(prevCount => prevCount + 1);
        await likePost(_id); // Call the API to like the post
      }
    } catch (error) {
      console.error("Error toggling like/unlike:", error);

      // Revert optimistic update on error
      setIsLiked(!isLiked);
      setLikeCount(prevCount => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  }; 

  const handleDelete = async () => {
    try {
      await deletePost(_id);
      onDelete(_id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="post-card">
      <div className="postBox">
        {/* <div className="postHeader">
          <img 
            src={avatarSrc} 
            alt={`${displayName}'s avatar`} 
            className="postAvatar"
          />
          <div className="userInfo">
            <div className="username">{username}</div>
          </div>
        </div> */}
        <UserProfileLink 
          userId={postedBy}
          avatarSrc={avatarSrc} 
          username={username} 
        />
        <button onClick={handleDelete}>Delete</button>
      </div>
      <div className='image-box'>
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt={description}
          className="postImage"
        />
      )} 
      </div>      
      <div className="postContent">
        <div className="description">{description}</div>
        <div className="postMeta">
          <div className="timestamp">{timestamp}</div>
          <div className="dateSeparator" />
          <div className="date">{date}</div>
        </div>
        <div className="interactions">
            <LuDog
              className="interactionButton"
              style={{ color: isLiked ? "red" : "black" }}
              aria-label={`${likeCount} likes`}
              size={30} // Adjust the size of the icon
              onClick={handleLikeClick} // Add click handler
            />
            <span>{likeCount}</span>
      <div className="interactions">
        <FaRegCommentDots
          className="interactionButton"
          aria-label={`${commentCount} comments`}
          size={30}
          onClick={openModal}
        />
        <span>{commentCount}</span>      
      </div>
      {isModalOpen && (
        <CommentModal
        post={{ _id, avatarSrc, username, caption: description, photo: imageSrc }}
          updateCommentCount={updateCommentCount}
          onClose={closeModal}
        />
      )}
    </div>
  </div>
</div>
  );
};

export default PostCard;