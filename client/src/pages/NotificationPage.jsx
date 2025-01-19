import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './NotificationsPage.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            if (!token) {
                setError('Please login to view notifications');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                'http://localhost:5003/api/user/notifications',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            console.log('Response:', response.data);
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            setError(error.response?.data?.error || 'Failed to fetch notifications');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="notifications-page">
                    <h1>Notifications</h1>
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="notifications-page">
                <h1>Notifications</h1>
                {loading ? (
                    <div className="loading">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="no-notifications">No new notifications</div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <div 
                                key={notification._id} 
                                className={`notification-card ${notification.type}`}
                            >
                                <div className="notification-content">
                                    <h3>{notification.title}</h3>
                                    <p>{notification.message}</p>
                                    <small>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
