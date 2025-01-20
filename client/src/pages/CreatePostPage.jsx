import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct way to import jwtDecode
import { createEducationPost } from "../api"; // Import the createPost function
import chatbotpic from "../Assets/Chatbot.jpg";
import Chatbot from "../components/Chatbot";
import "../pages/CreatePostPage.css";

function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // Track the chatbot visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or any secure storage
      if (!token) {
        throw new Error("You must be logged in to create a post.");
      }

      // Decode the JWT token to get user data
      const decodedToken = jwtDecode(token);

      // Prepare the post data, including user info in postedBy
      const postData = {
        title,
        content,
        postedBy: {
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        },
      };

      // Pass the post data along with the token to createPost API
      await createEducationPost(postData, token);

      alert("Post created successfully!");
      navigate("/coordinator/be-pet-experts"); // Redirect to the desired page after successful post creation
    } catch (err) {
      console.error("Error:", err); // Log the error for debugging
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className={`createPost ${isChatbotVisible ? "with-chatbot" : ""}`}>
      <div className="container">
        <h1 className="header">Create Post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="textarea"
          ></textarea>
          <button type="submit" className="button">
            Post
          </button>
        </form>
      </div>

      <div
        className="chatbot-toggle-button"
        onClick={() => setIsChatbotVisible(!isChatbotVisible)}
      >
        <img
          src={chatbotpic} // Use the same image
          alt="Toggle Chatbot"
          className={
            isChatbotVisible ? "chatbot-icon-active" : "chatbot-icon-inactive"
          } // Add a class to style it differently
        />
      </div>

      {isChatbotVisible && <Chatbot />}
    </div>
  );
}

export default CreatePostPage;
