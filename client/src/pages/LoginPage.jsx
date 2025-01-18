import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
