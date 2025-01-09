import React, { useState, useEffect, useRef } from "react";
import { PostCard } from "../../../components/CommunityComponent/PostCard";
import "./UserMyFeed.css";
import { fetchUserAndFollowedPosts, createPost, fetchUserPosts } from "../../../api";
import { BiSolidDog } from "react-icons/bi";
import CommentModal from "../../../components/CommunityComponent/CommentModal";

function MyFeed() {
    // State to track new post content
    const [newPost, setNewPost] = useState({
      text: "",
      image: null,
    });
  
    // State to retrieve list of posts
    const [posts, setPosts] = useState([]);

    const loadPosts = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        console.log("current role: ", role);
        console.log("Fetching posts for user ID:", userId);
        let posts = [];
        // if (role ==="user"){
          posts = await fetchUserAndFollowedPosts(userId);
        // }else if (role === "coordinator"){
        //   posts = await fetchUserPosts(userId);
        // }
        
        console.log("Fetched posts:", posts);
        setPosts(posts || []); // Fallback to an empty array
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]); // Handle error state
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
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
          setNewPost({ ...newPost, image: reader.result }); // Base64-encoded string
      };
  
      reader.onerror = (error) => {
          console.error("Error reading image file:", error);
      };
  
      reader.readAsDataURL(file); // Converts to Base64
  };
  const fileInputRef = useRef(null);
  
    // Handle post submission
    const handlePostSubmit = async (e) => {
      e.preventDefault();
      try {
        const newPostData = {
          caption: newPost.text,
          photo: newPost.image,
        };

        console.log("Submitting post data:", newPostData);
    
        await createPost(newPostData);
        const userId = localStorage.getItem("userId");
        const updatedPosts = await fetchUserAndFollowedPosts(userId);
        setPosts(updatedPosts);
    
        setNewPost({ text: "", image: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the file input
      }
      } catch (error) {
        console.error("Error submitting post:", error);
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
      <div className="Greeting">
      <BiSolidDog 
        size={40}
        color="493628"/>
      <h2>Paws-itively happy to see you again !</h2>
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
            <input id="choose-file" type="file" accept="image/*" onChange={handleImageUpload} />
            <button type="submit">Post</button>
          </div>
        </form>
      </div>
      <h2>Paws on over to check out what’s new in town !</h2>
      <div className="FeedPosts">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={index}
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
