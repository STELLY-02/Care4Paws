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
import EducationPage from "./pages/EducationHub";
import CreatePostPges from "./pages/CreatePostPage";
import ContextProvider from "./content/Context";
import ViewContent from "./pages/EduViewContent";
import UserEducationHub from "./pages/UserEducationHub";
import UserEduViewContent from "./pages/UserEduViewContent";
import UserDonation from "./pages/UserDonation";
import CoordinatorDonation from "./pages/CoordinatorDonation";
import Reportpet from "./pages/LostAndFound";

function App() {
    return (
        <ContextProvider>
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
                                <Route path="/be-pet-experts" element={<EducationPage />} />
                                <Route
                                    path="/be-pet-experts/create"
                                    element={<CreatePostPges />}
                                />
                                <Route
                                    path="/be-pet-experts/viewContent/:postId"
                                    element={<ViewContent />}
                                />
                                <Route path="/donation" element={<CoordinatorDonation />} />
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
                                {/* <Route path="/be-pet-experts" element={<Chatbot />} /> */}
                                <Route path="/community/*" element={<UserCommunityPage />} />
                                <Route path="/adoption" element={<UserAdoptionPage />} />
                                <Route
                                    path="/be-pet-experts"
                                    element={<UserEducationHub />}
                                />
                                <Route
                                    path="/be-pet-experts/viewContent/:postId"
                                    element={<UserEduViewContent />}
                                />
                                <Route path="/donation" element={<UserDonation />} />
                                <Route path="/edit-profile" element={<EditProfilePage />} />
                                <Route path="/reportpet" element={<Reportpet />} />
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
        </ContextProvider>
    );
}

export default App;
