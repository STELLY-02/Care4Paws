// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from "./components/Chatbot";
import EditProfilePage from "./components/EditProfilePage";
import UserCommunityPage from './pages/CommunityPage/UserCommunity/UserCommunityPage';
import CoordinatorCommunityPage from './pages/CommunityPage/CoordinatorCommunity/CoordinatorCommunityPage';
import Landing from './pages/Landing';
import CoordinatorAdoptionPage from './pages/AdoptionPage/CoorAdoption/CoordinatorAdoptionPage';
import UserAdoptionPage from './pages/AdoptionPage/UserAdoption/UserAdoptionPage';
import NotificationsPage from './pages/NotificationPage';
import NotificationPage from "./pages/NotificationPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Protected Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Routes>
                                <Route path="" element={<AdminDashboard />} />
                                {/* Add Admin-specific routes */}
                            </Routes>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/coordinator/*"
                    element={
                        <ProtectedRoute allowedRoles={['coordinator']}>
                            <Routes>
                                <Route path="" element={<CoordinatorDashboard />} />
                                <Route path="/community" element={<CoordinatorCommunityPage />} />
                                <Route path="/adoption" element={<CoordinatorAdoptionPage />} />
                            </Routes>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/*"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <Routes>
                                <Route path="" element={<UserDashboard />} />
                                <Route path="/be-pet-experts" element={<Chatbot />} />
                                <Route path="/community" element={<UserCommunityPage />} />
                                <Route path="/adoption" element={<UserAdoptionPage />} />
                            </Routes>
                        </ProtectedRoute>
                    }
                />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/notification" element={<NotificationPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;