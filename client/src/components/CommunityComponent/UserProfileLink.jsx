import React from 'react';
import { useHistory } from 'react-router-dom';
import './UserProfileLink.css';

const UserProfileLink = ({ userId, avatarSrc, username }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/user-profile/${userId}`);
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