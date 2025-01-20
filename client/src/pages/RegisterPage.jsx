import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import Alert from '@mui/material/Alert'; // Material-UI Alert for notifications
import { Link } from "react-router-dom"; 
import Logo from "../assets/Logo-fit.png"
import axios from 'axios';

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        avatarSrc: '',
        email: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
        console.log('Form Data Updated: ', formData); // Log form data on change
    };

    // Function to validate email and password
    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        
        console.log('Validating form data...');

        if (!emailRegex.test(formData.email)) {
            setError("Invalid email format.");
            console.log("Email validation failed: ", formData.email);
            return false;
        }
        if (!passwordStrengthRegex.test(formData.password)) {
            setError("Password must be at least 8 characters long, with at least one letter and one number.");
            console.log("Password validation failed: ", formData.password);
            return false;
        }

        // Clear any previous error
        setError('');
        console.log('Form is valid');
        return true;
    };

    const handleProPicUpload = async (e) => {
      const file = e.target.files[0];
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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.avatarSrc = uploadedImageUrl;
        console.log('Form submitted with data: ', formData);

        // Validate form before sending request
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        try {
            // Clear previous success/error messages before attempting registration
            setError('');
            setSuccess('');
            console.log('Making API call to register user...');
            await waitForUploadedImage();

            await registerUser(formData); // Call the API to register the user
            console.log('Registration successful');
            setSuccess('Registration successful! Please log in.');
            
            setTimeout(() => {
              if (formData.role === 'coordinator') navigate('/coordinator');
              else navigate('/user');
            }, 2000); // Redirect after 2 seconds to show success message
        } catch (err) {
            console.error('Registration error: ', err); // Log any error during registration
            setError(err.message || 'Registration failed'); // Set error message if registration fails
        }
    };

    return (
        <div className="register-container">
          <div className= "register-content">
          <div className="welcome-section">
                <img src={Logo} alt="Care4Paws Logo" className="logo" />
                <h1>
                    Welcome to <span className="care4paws-title">Care4Paws</span>
                </h1>
                <p>
                    Find your loyal companion and connect with fellow pet lovers.<br />
                    Together, we can share, care, and make a difference.
                </p>
                </div>
          <div className="register-section">
            <h1>Register</h1>
            <p>First create your account.</p>
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
                    <label className="label-width" htmlFor="profile-picture">Choose your profile picture</label>
                    <input
                    name="avatarSrc"
                    type="file"
                    accept="image/*"
                    onChange={handleProPicUpload} 
                    required
                />
            </div>

            <div className="form-row">
              <textarea
                name="description"
                placeholder="Write a little decription of you"
                value={formData.description}
                onChange={handleChange}
                className="text-description"
              />
            </div>

              <div className="role-column">
              <h5>Please choose your role accordingly for different experience !<br/>
              Choose Coordinator, if your are part of an organization</h5>
              <select name="role" value={formData.role} onChange={handleChange} required className="custom-select">
              <option value="">Select Role</option>
              <option value="coordinator">Coordinator</option>
              <option value="user">User</option>
          </select>
                </div>
              {/* <div className="checkbox-row">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <label>
                  <input type="checkbox" /> I agree to the Terms and Privacy policy
                </label>
              </div> */}
              <button type="submit" className="create-account-btn">Create account</button>
            </form>
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
          
          </div>
          <footer>
            Copyright © Care4Paws, 2020 - 2024. All rights reserved.
          </footer>
        </div>
        
      );
}

export default RegisterPage;
