import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { SidebarData } from "../../components/SidebarData";
import { fetchUserPosts, fetchFollowedIds, followUser, unfollowUser } from '../../api';
import { PostCard } from '../../components/CommunityComponent/PostCard';
import Logo from "../../assets/logo.png";
import NotificationIcon from "../../assets/notification-icon.svg";
import Chaticon from "../../assets/chat-icon.svg";
import Avatar from "../../assets/account-circle-icon.svg";
import Cutepic from "../../assets/Login Page.png";
import MoveInIcon from "../../assets/arrow-back-icon.svg";
import MoveOutIcon from "../../assets/arrow-forward-icon.svg";
import { Link } from "react-router-dom";
import axios from 'axios';

const UserProfile = () => {
  const { interestedId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [followedIds, setFollowedIds] = useState([]);

  const sidebarData = SidebarData("coordinator");

  const handleBackClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8085/api/users/profile/${interestedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [interestedId]);

  useEffect(() => {
    const getFollowedIds = async () => {
      try {
        const currentId = localStorage.getItem('userId');
        const followedIds = await fetchFollowedIds(currentId);
        setFollowedIds(followedIds);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };
    getFollowedIds();
  }, [interestedId]);

  const handleAdd = async (id) => {
    try {
      const currentId = localStorage.getItem('userId');
      await followUser(currentId, id, followedIds);
      setFollowedIds([...followedIds, id]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const currentId = localStorage.getItem('userId');
      await unfollowUser(currentId, id);
      setFollowedIds(followedIds.filter(followedId => followedId !== id));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchUserPosts(interestedId);
        setPosts(posts || []);
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    };
    loadPosts();
  }, [interestedId]);

  return (
    <>
      <div className="navbar">
        <div className="navleft">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="navright">
          <div className="chatNoti">
            <img src={NotificationIcon} alt="Notification" className="notiicon" />
            <img src={Chaticon} alt="Chat" className="chaticon" />
          </div>
          <div className="propic">
            <Link to="/edit-profile">
              <img src={Avatar} alt="Avatar" className="avatar" />
            </Link>
          </div>
        </div>
      </div>
      <div className="homebottom">
        <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul className="sidebarList">
            {sidebarData.map((val, key) => (
              <li key={key} className="sidebarRow" onClick={() => window.location.pathname = val.link}>
                <div id="sidebarIcon">{val.icon}</div>
                {isSidebarOpen && <div id="sidebarTitle">{val.title}</div>}
              </li>
            ))}
          </ul>
          <div className="sidebarBottom">
            {isSidebarOpen && <img src={Cutepic} alt="Sidebar Bottom" className="sidebarBottomImage" />}
          </div>
          <div
            className="sidebarToggle"
            onClick={() => setIsSidebarOpen(prev => !prev)}
          >
            <img src={isSidebarOpen ? MoveInIcon : MoveOutIcon} alt="Toggle Sidebar" />
          </div>
        </div>
        <div className="UserPostLits">
          <div className="UserProfile">
          <button className="backButton" onClick={handleBackClick}>Back</button>
            {profile && (
              <>
                <div className="profileHeader">
                  <img src={profile.avatarSrc || Avatar} alt={`${profile.username}'s avatar`} className="profileAvatar" />
                  <div className="profileInfo">
                    <h2>{profile.username}</h2>
                    <p>{profile.firstName} {profile.lastName}</p>
                    <p>Joined since: {new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className = "follow-button" onClick={followedIds.includes(interestedId) ? 
                  () => handleRemove(interestedId) : 
                  () => handleAdd(interestedId)
                }>
                  {followedIds.includes(interestedId) ? 'Unfollow' : 'Follow'}
                </button>
              </>
            )}
          </div>
          <div className="InfluencerContent">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={index}
                _id={post._id}
                postedBy={post.postedBy}
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
                // onDelete={handleDeletePost}
              />
            ))
          ) : (
            <p>No posts to display.</p>)}
      </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
