import React, { useState, useEffect, useRef } from "react";
import { PostCard } from "../../../components/CommunityComponent/PostCard";
import "./UserMyFeed.css";
import { fetchUserAndFollowedPosts, createPost, fetchUserPosts } from "../../../api";
import CommentModal from "../../../components/CommunityComponent/CommentModal";
import axios from 'axios';
import CuteDog from "../../../assets/dogwlove.png"
import CuteDog2 from "../../../assets/cutedog2.png"


function MyFeed() {
    // State to track new post content
    const [newPost, setNewPost] = useState({
      text: "",
      image: null,
    });
    const fileInputRef = useRef(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  
    // State to retrieve list of posts
    const [posts, setPosts] = useState([]);

    const loadPosts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        console.log("current role: ", role);
        console.log("Fetching posts for user ID:", userId);
        let posts = [];
        posts = await fetchUserAndFollowedPosts(userId);
        
        console.log("Fetched posts:", posts);
        setPosts(posts || []);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      }
    };

    useEffect(() => {
      loadPosts();
  }, []);
  
    // Handle text changes in the new post form
    const handlePostChange = (e) => {
      console.log(e);
      const { name, value } = e.target; //HTML element that triggered the event
      setNewPost({ ...newPost, [name]: value }); //dynamically updates all field
    };            //spread operator, copy all properties from newPost
  
    // Handle image upload
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
  
    // Handle post submission
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
        const userId = localStorage.getItem("userId");
        const updatedPosts = await fetchUserAndFollowedPosts(userId);
        setPosts(updatedPosts);
        alert("Post submitted successfully!");
    
        setNewPost({ text: "", image: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the file input
      }
      } catch (error) {
        console.error("Error submitting post:", error);
        alert("Failed to submit post. Please try again.");
      }
    };

    //handle comment modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalData, setModalData] = useState(null);

    const openModal = (postId, updateCommentCount) => {
      const selected = posts.find((post) => post._id === postId);
      console.log("Selected post:", selected);
      setSelectedPost(selected);
      setIsModalOpen(true);
      setModalData({ updateCommentCount });
    };
  
    const closeModal = () => {
      setSelectedPost(null);
      setIsModalOpen(false);
    };

    useEffect(() => {
      // When selectedPost changes, open the modal after the state is updated
      if (selectedPost) {
        setIsModalOpen(true);
      }
    }, [selectedPost]);  // This hook will run whenever selectedPost changes

    const handleDeletePost = (postId) => {
      setPosts(posts.filter(post => post._id !== postId));
    };

  return (
    <>
      <div className="MyFeed">
      <div className='coordinator-header'>
        <img src={CuteDog} alt="" className="cute-dog" />
        <h1>Welcome back, fur-tastic friend ! Let's see what's paw-pular today</h1>
      </div>
      <div className="PostCreationForm">     
        <h3>Share Something Today!</h3>
        <form onSubmit={handlePostSubmit}>
          <textarea
            name="text"
            placeholder="What's on your mind?"
            value={newPost.text}
            onChange={handlePostChange}
          />
          <div className="form-actions">
            <input id="choose-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} />
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
      <div className='coordinator-intro'>
        <img src={CuteDog2} alt="" className="cute-dog2" />
        <h3>Paw Over and Check What's New in the Town! </h3>
        </div>
      <div className="FeedPosts">
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
            onDelete={handleDeletePost}
          />
        ))
      ) : (
        <p>No posts to display.</p>)}
        </div>
        {isModalOpen && selectedPost && (
          <CommentModal post={selectedPost} onClose={closeModal} updateCommentCount={modalData} />
        )}
        </div>
    </>
  );
}

export default MyFeed;
