// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditProfilePage from './pages/EditProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from "./components/Chatbot";
import UserCommunityPage from './pages/CommunityPage/UserCommunity/UserCommunityPage';
import CoordinatorCommunityPage from './pages/CommunityPage/CoordinatorCommunity/CoordinatorCommunityPage';
import UserProfile from './pages/CommunityPage/UserProfile';
import Landing from './pages/Landing';
import LiveStreamRouting from './components/CommunityComponent/LiveStreamRouting';
import { HLSLivestreamUI } from './components/CommunityComponent/viewers/HLSLivestream';
// import { WebRTCLivestream } from './components/CommunityComponent/viewers/WebRTCLivestream';
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
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/user-profile/:interestedId" element={<UserProfile />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/notification" element={<NotificationPage />} />
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
                                <Route path="/community/*" element={<CoordinatorCommunityPage />} />
                                <Route path="/adoption" element={<CoordinatorAdoptionPage />} />
                                <Route path="/community/livestream/*" element={<LiveStreamRouting />}>
                                <Route path="viewers">
                                    <Route path="hls/:callId" element={<HLSLivestreamUI />} />
                                    {/* <Route path="webrtc/:callId" element={<WebRTCLivestream />} /> */}
                                </Route>
                                </Route>
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
                                <Route path="/community/*" element={<UserCommunityPage />} />
                                <Route path="/adoption" element={<UserAdoptionPage />} />
                                <Route path="/community/livestream/*" element={<LiveStreamRouting />}>
                                <Route path="viewers">
                                    <Route path="hls/:callId" element={<HLSLivestreamUI />} />
                                    {/* <Route path="webrtc/:callId" element={<WebRTCLivestream />} /> */}
                                </Route>
                                </Route>
                            </Routes>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
