import React, { useState, useRef } from 'react';
import PostCreationModal from './PostCreationModal';
import './ActiveCampaignCard.css';
import { createPost, fetchPostsByTitle } from '../../api';
import Logo from '../../assets/Logo-fit.png';
import PostModal from './PostModal';
import axios from 'axios';

const ActiveCampaignCard = ({ campaign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ text: campaign.title, image: null });
  const fileInputRef = useRef(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleAddPost = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, text: e.target.value });
  };

  const handleImageUpload = async (file) => {
    console.log("handleImageUpload called");
    console.log("Selected file:", file);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8085/api/uploadPic/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Image uploaded:", response.data);
      setUploadedImageUrl(response.data.data); // Cloudinary URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

const handleDeletePost = () => {
  console.log("Deleting post with ID:");
};

const waitForUploadedImage = async () => {
  const maxRetries = 10; // Limit retries to prevent infinite loops
  const retryDelay = 500; // Retry every 500ms
  let retries = 0;

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (uploadedImageUrl) {
        clearInterval(interval);
        resolve(); // Resolve when uploadedImageUrl is available
      } else if (retries >= maxRetries) {
        clearInterval(interval);
        reject(new Error("Image upload timed out. Please try again."));
      } else {
        retries++;
      }
    }, retryDelay);
  });
};

  const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
          await waitForUploadedImage();
          const newPostData = {
            caption: newPost.text,
            photo: uploadedImageUrl,
          };
  
          console.log("Submitting post data:", newPostData);
      
          await createPost(newPostData);
          const updatedPosts = await fetchPostsByTitle(campaign.title);
          setPosts(updatedPosts);
      
          setNewPost({ text: "", image: null });
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
        }
        } catch (error) {
          console.error("Error submitting post:", error);
        }
      };

      const handleViewPosts = async () => {
        try {
          console.log("Fetching posts with the same caption:", campaign.title);
          const posts = await fetchPostsByTitle(campaign.title);
          console.log("Fetched posts with the same caption:", posts);
          setPosts(posts);
          setIsPostModalOpen(true);
        } catch (error) {
          console.error("Error fetching posts by caption:", error);
        }
      };

      const handleClosePostModal = () => {
        setIsPostModalOpen(false);
      };

  return (
    <div className="active-campaign-card">
      <img src={Logo} alt="" className="logo-active" />
      <h2>{campaign.title}</h2>
      <p>{campaign.description}</p>
      <div className='button-alignment'>
        <button onClick={handleAddPost}>Add Post</button>
        <button onClick={handleViewPosts}>View Posts</button>
      </div>
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        campaignTitle={campaign.title}
        handlePostSubmit={handlePostSubmit}
        newPost={newPost}
        handlePostChange={handlePostChange}
        handleImageUpload={handleImageUpload}
      />
      <PostModal
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        posts={posts}
        handleDeletePost={handleDeletePost}
      />
    </div>
  );
};

export default ActiveCampaignCard;