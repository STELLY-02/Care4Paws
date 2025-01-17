import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from "../../../components/SidebarData";
import Navbar from "../../../components/Navbar";
import './CoordinatorAdoption.css';

const CoordinatorAdoptionPage = () => {
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        console.log('CoordinatorAdoptionPage mounted');
        console.log('Token:', token);
    }, [token]);

    const [activeTab, setActiveTab] = useState('add');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        breed: '',
        vaccinated: false,
        description: '',
        photo: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                photo: files[0]
            }));
            // Create preview URL for image
            const url = URL.createObjectURL(files[0]);
            setPreviewUrl(url);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            console.error('No token found');
            alert('Please login again');
            return;
        }

        try {
            const formDataToSend = new FormData();
            
            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'photo') {
                    if (formData[key]) {
                        formDataToSend.append('photo', formData[key]);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Debug logs
            console.log('Sending form data:', Object.fromEntries(formDataToSend));
            console.log('Token being sent:', token);

            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend,
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                setFormData({
                    name: '',
                    age: '',
                    breed: '',
                    vaccinated: false,
                    description: '',
                    photo: null
                });
                setPreviewUrl(null);
                alert('Pet added successfully!');
            } else {
                throw new Error(responseData.error || 'Failed to add pet');
            }
        } catch (error) {
            console.error('Error adding pet:', error);
            alert('Failed to add pet. Please try again.');
        }
    };

    try {
        return (
            <div className="page-container">
                <Navbar />
                <div className="content-wrapper">
                    <div className="sidebar">
                        {SidebarData("coordinator").map((item, index) => {
                            return (
                                <Link to={item.link} key={index} className="sidebar-link">
                                    <div className="sidebar-item">
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    
                    <div className="main-content">
                        <div className="coor-adoption-container">
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === 'add' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('add')}
                                >
                                    Add Pet
                                </button>
                                <button
                                    className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('manage')}
                                >
                                    Manage Pets
                                </button>
                                <button
                                    className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('requests')}
                                >
                                    Adopt Requests
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'add' && (
                                    <form className="add-pet-form" onSubmit={handleSubmit} encType="multipart/form-data">
                                        <h2>Add New Pet</h2>

                                        <div className="form-group">
                                            <label htmlFor="name">Pet Name:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="age">Age:</label>
                                            <input
                                                type="number"
                                                id="age"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="breed">Breed:</label>
                                            <input
                                                type="text"
                                                id="breed"
                                                name="breed"
                                                value={formData.breed}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group checkbox">
                                            <label htmlFor="vaccinated">
                                                <input
                                                    type="checkbox"
                                                    id="vaccinated"
                                                    name="vaccinated"
                                                    checked={formData.vaccinated}
                                                    onChange={handleInputChange}
                                                />
                                                Vaccinated
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Description:</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="photo">Photo:</label>
                                            <input
                                                type="file"
                                                id="photo"
                                                name="photo"
                                                accept="image/*"
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {previewUrl && (
                                                <div className="image-preview">
                                                    <img src={previewUrl} alt="Preview" />
                                                </div>
                                            )}
                                        </div>

                                        <button type="submit" className="submit-btn">Add Pet</button>
                                    </form>
                                )}

                                {activeTab === 'manage' && (
                                    <div className="manage-pets">
                                        <h2>Manage Pets</h2>
                                    </div>
                                )}

                                {activeTab === 'requests' && (
                                    <div className="adopt-requests">
                                        <h2>Adoption Requests</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error rendering CoordinatorAdoptionPage:', error);
        return <div>Error loading adoption page. Please try again.</div>;
    }
};

export default CoordinatorAdoptionPage;