import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEducationPosts, deleteEducationPost } from "../api"; // Import the API function to get posts
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./EducationHub.css";
import DeleteIcon from "../Assets/delete.svg";

const colors = [
  "#FCFFC1",
  "#FFE893",
  "#FBB4A5",
  "#FFD700",
  "#F5EFFF",
  "#E5D9F2",
  "#CDC1FF",
  "#D9EAFD",
  "#C6E7FF",
];

// Function to get a random color from the predefined colors
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
const EducationHub = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [showConfirm, setShowConfirm] = useState(false); // To track the confirmation modal
  const [postToDelete, setPostToDelete] = useState(null); // Track which post to delete

  useEffect(() => {
    // Fetch posts when the component mounts
    const fetchPosts = async () => {
      try {
        const data = await getEducationPosts(); // Fetch posts from API
        setPosts(data); // Store posts in state
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId); // Set the post ID to be deleted
    setShowConfirm(true); // Show the confirmation modal
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("You must be logged in to delete a post.");
      }

      await deleteEducationPost(postToDelete, token); // Pass the post ID and token to deletePost function
      setPosts(posts.filter((post) => post._id !== postToDelete)); // Remove the post from state
      setShowConfirm(false); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false); // Close the confirmation modal without deleting
  };

  return (
    <div className="EducationHub">
      <Navbar />

      <div className="EducationHubBottom">
        <Sidebar />

        <div className="EduWrap">
          <h2 className="education-hub-title">Education Hub</h2>
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p>No posts available</p>
          ) : (
            <div className="posts-container">
              {posts.map((post) => (
                <div key={post._id} className="post-card-container">
                  {/* Delete Button */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClick(post._id)}
                  >
                    <img src={DeleteIcon} alt="Delete" />
                  </button>

                  <Link
                    to={`/coordinator/be-pet-experts/viewContent/${post._id}`}
                    // key={post._id}
                    className="post-link"
                  >
                    <div
                      // key={post._id}
                      className="post-card"
                      style={{ backgroundColor: getRandomColor() }} // Apply random color to each card
                    >
                      <div class="post-card-content">
                        <h3>{post.title}</h3>
                        <div className="posted-by">
                          <p>Posted by: {post.postedBy.username}</p>
                          {/* <p>Role: {post.postedBy.role}</p> */}
                          {/* Optionally include a snippet of content */}
                          {/* <p>{post.content.slice(0, 100)}...</p> */}
                          {/* <p>{post.content}</p> */}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete this post?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
      <button className="add-post-button">
        <Link to="/coordinator/be-pet-experts/create">+</Link>
      </button>
    </div>
  );
};

export default EducationHub;
