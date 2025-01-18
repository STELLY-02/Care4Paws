import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from "../../../components/SidebarData";
import Navbar from "../../../components/Navbar";
import './CoordinatorAdoption.css';
import { addPet } from '../../../api';  // Import the addPet function

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file);  // Debug log
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate photo first
            if (!formData.photo) {
                alert('Please select a photo');
                return;
            }

            const formDataToSend = new FormData();
            
            // Add all fields to FormData
            formDataToSend.append('name', formData.name);
            formDataToSend.append('age', formData.age);
            formDataToSend.append('breed', formData.breed);
            formDataToSend.append('vaccinated', formData.vaccinated);
            formDataToSend.append('description', formData.description);
            
            // Add photo last
            formDataToSend.append('photo', formData.photo);

            // Debug log
            console.log('Submitting form with:', {
                name: formData.name,
                age: formData.age,
                breed: formData.breed,
                vaccinated: formData.vaccinated,
                description: formData.description,
                photoName: formData.photo.name
            });

            // Log FormData contents
            for (let pair of formDataToSend.entries()) {
                console.log('FormData entry:', pair[0], ':', 
                    pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]
                );
            }

            const response = await addPet(formDataToSend);
            console.log('Success:', response);

            // Reset form on success
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
        } catch (error) {
            console.error('Error adding pet:', error);
            alert(error.message || 'Failed to add pet');
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
                                                onChange={handleFileChange}
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