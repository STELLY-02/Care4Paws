import React, { useState, useEffect } from "react";
import "./EditProfilePage.css";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../api";
import Alert from "@mui/material/Alert"; // Material-UI Alert for notifications
import Logo from "../assets/Logo-fit.png";
import axios from "axios";

function EditProfilePage() {
  const [formData, setFormData] = useState({
    username: "",
    avatarSrc: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    description: "",
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage and prefill the form
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData({ ...response.data, role }); // Prefill form data
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProPicUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8085/api/uploadPic/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const role = localStorage.getItem("role");
      await waitForUploadedImage();
      const updatedData = { ...formData, role, avatarSrc: uploadedImageUrl };
      console.log(updatedData);
      await editProfile(updatedData); // API call to edit profile
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/user"), 2000); // Redirect after success
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="welcome-section">
          <img src={Logo} alt="Care4Paws Logo" className="logo" />
          <h1>
            Welcome to <span className="care4paws-title">Care4Paws</span>
          </h1>
        </div>
        <div className="register-section">
          <h1>Edit Profile</h1>
          <p>Update your profile information here.</p>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label className="label-width" htmlFor="profile-picture">
                Choose your profile picture
              </label>
              <input
                name="avatarSrc"
                type="file"
                accept="image/*"
                onChange={handleProPicUpload}
              />
            </div>
            <div className="form-row">
              <textarea
                name="description"
                placeholder="Write a little description of yourself"
                value={formData.description}
                onChange={handleChange}
                className="text-description"
              />
            </div>
            <button type="submit" className="create-account-btn">
              Update Changes
            </button>
          </form>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </div>
      </div>
      <footer>Copyright © Care4Paws, 2020 - 2024. All rights reserved.</footer>
    </div>
  );
}

export default EditProfilePage;
