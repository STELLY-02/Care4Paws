import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEducationPostById } from "../api";
import "./EduViewContent.css";
import chatbotpic from "../Assets/Chatbot.jpg";
import Chatbot from "../components/Chatbot";

const EduViewContent = () => {
  const { postId } = useParams(); // Extract the postId from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // State to manage chatbot visibility

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getEducationPostById(postId); // Fetch post by ID
        console.log("data", data);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (!post) {
    return (
      <div>
        <p>Post not found or no data available.</p>
        <Link to="/coordinator/be-pet-experts">Go Back</Link>
      </div>
    );
  }

  return (
    <div
      className={`post-containerV ${isChatbotVisible ? "chatbot-active" : ""}`}
    >
      <div className="post-cardV">
        <h1 className="post-titleV">{post.title}</h1>
        <p className="post-contentV">{post.content}</p>
        <Link to="/coordinator/be-pet-experts">Back to Posts</Link>
      </div>

      <div
        className="chatbot-toggle-buttonV"
        onClick={() => setIsChatbotVisible(!isChatbotVisible)}
      >
        <img
          src={chatbotpic} // Use the chatbot image
          alt="Toggle Chatbot"
          className={
            isChatbotVisible ? "chatbot-icon-activeV" : "chatbot-icon-inactiveV"
          }
        />
      </div>
      {isChatbotVisible && <Chatbot />}
    </div>
  );
};

export default EduViewContent;
