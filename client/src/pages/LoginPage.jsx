import React, { useState, useEffect } from 'react';
import { useNavigate,Link, useLocation } from 'react-router-dom';
import { loginUser } from '../api';
import "./Login.css";
import care4pawsLogo from "../assets/Care4Paws.png";
import Logo from "../assets/Logo-fit.png"

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token, role, userId, username } = await loginUser(formData);
            localStorage.setItem('token', token); // Save token
            localStorage.setItem('role', role);   // Save role 
            localStorage.setItem('userId',userId);
            localStorage.setItem('user', JSON.stringify({ id: userId, name: username }));
            //alert('Login successful! Redirecting...');
            // Redirect based on role
            if (role === 'admin') navigate('/admin');
            else if (role === 'coordinator') navigate('/coordinator');
            else navigate('/user');
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className='main-div'>
            <div className="first-container">
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
                <div className="login-section">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} placeholder="Enter your email" required />
                    <label>Password</label>
                    <div className="password-input">
                    <input
                        name="password"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? "👁️" : "🙈"}
                    </button>
                    </div>
                    {/* <div className="remember-forgot">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="/forgot-password" className="forgot-password-link">
                        Forgot Password
                    </a>
                    </div> */}
                    <button type="submit" className="login-btn">
                    Login
                    </button>
                    <p className="or-divider">Not a member?</p>
                    <Link to="/register" className="join-link">
                    Join Us Today!
                    </Link>
                </form>
                </div>
            </div>
            <footer>
                Copyright © Care4Paws, 2020 - 2024. All rights reserved.
            </footer>
        </div>
    );
}

export default LoginPage;
