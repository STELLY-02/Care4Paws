import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import Alert from '@mui/material/Alert'; // Material-UI Alert for notifications

function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        avaterSrc: '',
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

    const handleProPicUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = () => {
            setFormData((prevData) => ({
                ...prevData,
                avaterSrc: reader.result, // Update `avaterSrc` with Base64 string
            }));
            console.log("Profile picture uploaded:", reader.result);
        };
    
        reader.onerror = (error) => {
            console.error("Error reading image file:", error);
        };
    
        reader.readAsDataURL(file); // Converts to Base64
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

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

            await registerUser(formData); // Call the API to register the user
            console.log('Registration successful');
            setSuccess('Registration successful! Please log in.');
            
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after success
            }, 2000); // Redirect after 2 seconds to show success message
        } catch (err) {
            console.error('Registration error: ', err); // Log any error during registration
            setError(err.message || 'Registration failed'); // Set error message if registration fails
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {/* Show error or success messages conditionally */}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            
            <form onSubmit={handleSubmit}>
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="user">User</option>
                </select>
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    name="avaterSrc"
                    type="file"
                    accept="image/*"
                    onChange={handleProPicUpload} 
                    required
                />
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
                <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
