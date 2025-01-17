import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfileLink.css';

const UserProfileLink = ({ userId, avatarSrc, username }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to user profile:", userId);
    const currentUserId = localStorage.getItem("userId");
    console.log("Current user ID:", currentUserId);
    navigate(`/user-profile/${userId}`);
  };

  return (
    <div className="userProfileLink" onClick={handleClick}>
      <img 
        src={avatarSrc} 
        alt={`${username}'s avatar`} 
        className="postAvatar"
      />
      <div className="userInfo">
        <div className="username">{username}</div>
      </div>
    </div>
  );
};

export default UserProfileLink;