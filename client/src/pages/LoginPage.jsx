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
            const response = await loginUser(formData);
            console.log('Login response:', response); // Debug log

            const { token, role, userId } = response;
            
            // Debug logs
            console.log('Storing in localStorage:', {
                token,
                role,
                userId
            });

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);

            // Debug log after storing
            console.log('Stored values:', {
                storedToken: localStorage.getItem('token'),
                storedRole: localStorage.getItem('role'),
                storedUserId: localStorage.getItem('userId')
            });

            switch(role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'coordinator':
                    navigate('/coordinator');
                    break;
                case 'user':
                    navigate('/user');
                    break;
                default:
                    setError('Invalid role');
                    break;
            }
        } catch (err) {
            console.error('Login error:', err);
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
