import React, { useEffect, useState } from "react";
import "./Mypost.css";
import { getUserPosts } from "../api"; // Assuming this API call is correctly implemented

const MyPosts = ({ token }) => {
  const BASE_URL = "http://localhost:8085";
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getUserPosts(token);
        const combinedPosts = [...(data.lostReports || []), ...(data.foundReports || [])];
        setPosts(combinedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleImageError = (postId) => {
    setImageErrors((prev) => ({
      ...prev,
      [postId]: true,
    }));
    console.error(`Failed to load image for post ${postId}`);
  };

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) {
      return photoPath;
    }
    return `${BASE_URL}/${photoPath.replace(/^\/+/, "")}`;
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="posts-container">
      <div className="posts-list">
        {posts.length === 0 ? (
          <div>No posts found.</div>
        ) : (
          posts.map((post, index) => (
            <div className="post-card" key={post._id || index}>
              <div className="post-photo">
                {post.photo && !imageErrors[post._id] ? (
                  <img
                    src={getImageUrl(post.photo)}
                    alt={post.petName || "Pet"}
                    className="pet-photo"
                    onError={() => handleImageError(post._id)}
                  />
                ) : (
                  <div className="photo-placeholder">No photo available</div>
                )}
              </div>
              <div className="post-details">
                <h3>{post.reportType === "Lost" ? "Lost Pet" : "Homeless Pet"}</h3>
                {post.reportType === "Lost" && (
                  <>
                    <p>
                      <strong>Name:</strong> {post.petName || "Unnamed Pet"}
                    </p>
                    <p>
                      <strong>Age:</strong> {post.petAge || "Unknown"}
                    </p>
                  </>
                )}
                <p>
                  <strong>Type:</strong> {post.petType}
                </p>
                <p>
                  <strong>Gender:</strong> {post.petGender}
                </p>
                <p>
                  <strong>Breed:</strong> {post.petBreed}
                </p>
                <p>
                  <strong>Location:</strong> {post.location}
                </p>
                <button
                  className="view-details-btn"
                  onClick={() => handleViewDetails(post)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Detailed Profile</h2>
            <div className="modal-photo">
              {selectedPost.photo && !imageErrors[selectedPost._id] ? (
                <img
                  src={getImageUrl(selectedPost.photo)}
                  alt={selectedPost.petName || "Pet"}
                  className="pet-photo"
                  onError={() => handleImageError(selectedPost._id)}
                />
              ) : (
                <div className="photo-placeholder">No photo available</div>
              )}
            </div>
            {selectedPost.reportType === "Lost" && (
              <>
                <p>
                  <strong>Name:</strong> {selectedPost.petName || "Unnamed Pet"}
                </p>
                <p>
                  <strong>Age:</strong> {selectedPost.petAge || "Unknown"}
                </p>
              </>
            )}
            <p>
              <strong>Type:</strong> {selectedPost.petType || "Unknown"}
            </p>
            <p>
              <strong>Gender:</strong> {selectedPost.petGender}
            </p>
            <p>
              <strong>Breed:</strong> {selectedPost.petBreed}
            </p>
            <p>
              <strong>Color:</strong> {selectedPost.petColor || "Unknown"}
            </p>
            <p>
              <strong>Location:</strong> {selectedPost.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedPost.description || "No description available"}
            </p>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
