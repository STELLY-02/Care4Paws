import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${userId}`);
        setUser(userResponse.data);

        const postsResponse = await axios.get(`/api/posts/user/${userId}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userProfile">
      <div className="profileHeader">
        <img src={user.avatarSrc} alt={`${user.username}'s avatar`} className="profileAvatar" />
        <div className="profileInfo">
          <h2>{user.username}</h2>
        </div>
      </div>
      <div className="profilePosts">
        {posts.map((post, index) => (
          <div key={index} className="profilePost">
            <img src={post.photo} alt="Post" className="profilePostImage" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;