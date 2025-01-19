import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from "../../../components/SidebarData";
import Navbar from "../../../components/Navbar";
import './CoordinatorAdoption.css';
import { addPet, updateAdoptionStatus, getAdoptionRequests } from '../../../api';  // Import the addPet function
import axios from 'axios';

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
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);
    const [editingPet, setEditingPet] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

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
        const formDataToSend = new FormData();
        
        // Append all form data
        formDataToSend.append('name', formData.name);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('breed', formData.breed);
        formDataToSend.append('age', formData.age);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('vaccinated', formData.vaccinated);
        formDataToSend.append('description', formData.description);
        if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5003/api/pets',  // Changed from /pets to /api/pets
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Pet added successfully:', response.data);
            alert('Pet added successfully!');
            setFormData({
                name: '',
                age: '',
                breed: '',
                vaccinated: false,
                description: '',
                photo: null
            });
            setPreviewUrl(null);
        } catch (error) {
            console.error('Add pet error details:', error);
            alert('Failed to add pet. Please try again.');
        }
    };

    useEffect(() => {
        const fetchAdoptionRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdoptionRequests();
                setAdoptionRequests(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'requests') {
            fetchAdoptionRequests();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'manage') {
            const fetchPets = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('No token found');
                        return;
                    }

                    const response = await axios.get('http://localhost:5003/api/pets', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    console.log('Pet data received:', response.data); // Debug log
                    setPets(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching pets:', error);
                    setLoading(false);
                }
            };

            fetchPets();
        }
    }, [activeTab]);

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const confirmMessage = newStatus === 'approved' 
                ? 'Are you sure you want to approve this adoption request?' 
                : 'Are you sure you want to reject this adoption request?';
                
            if (!window.confirm(confirmMessage)) {
                return;
            }

            const response = await updateAdoptionStatus(requestId, newStatus);

            setAdoptionRequests(prev => 
                prev.map(request => 
                    request._id === requestId 
                        ? { ...request, status: newStatus }
                        : request
                )
            );

            const successMessage = newStatus === 'approved'
                ? 'Adoption request has been approved! A notification has been sent to the user.'
                : 'Adoption request has been rejected. A notification has been sent to the user.';
            
            alert(successMessage);

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    const handleDelete = async (petId) => {
        if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                
                // Send delete request to backend
                await axios.delete(`http://localhost:5003/api/pets/${petId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Remove pet from local state
                setPets(prevPets => prevPets.filter(pet => pet._id !== petId));
                
                // Show success message
                alert('Pet deleted successfully');
            } catch (error) {
                console.error('Error deleting pet:', error);
                alert('Failed to delete pet. Please try again.');
            }
        }
    };

    const handleEdit = (pet) => {
        setEditingPet(pet);
        setShowEditModal(true);
    };

    const handleUpdate = async (updatedPetData) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Sending update for pet:', editingPet._id);
            console.log('Update data:', updatedPetData);

            const response = await axios.put(
                `http://localhost:5003/api/pets/${editingPet._id}`,
                updatedPetData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update response:', response.data);

            // Update the pets list with the updated pet
            setPets(prevPets => 
                prevPets.map(pet => 
                    pet._id === editingPet._id ? response.data : pet
                )
            );

            setShowEditModal(false);
            setEditingPet(null);
            alert('Pet updated successfully');
        } catch (error) {
            console.error('Error updating pet:', error.response?.data || error.message);
            alert('Failed to update pet. Please try again.');
        }
    };

    const EditPetModal = ({ pet, onClose, onUpdate }) => {
        const [formData, setFormData] = useState({
            name: pet.name || '',
            type: pet.type || '',
            breed: pet.breed || '',
            age: pet.age || '',
            gender: pet.gender || '',
            vaccinated: pet.vaccinated || false,
            description: pet.description || '',
            status: pet.status || 'available'
        });

        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Submitting form data:', formData);
            onUpdate(formData);
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Edit Pet</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Breed:</label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Age:</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="vaccinated"
                                    checked={formData.vaccinated}
                                    onChange={handleChange}
                                />
                                Vaccinated
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="available">Available</option>
                                <option value="adopted">Adopted</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="accept-btn">Save Changes</button>
                            <button type="button" className="reject-btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderAdoptRequests = () => {
        if (loading) return <div>Loading adoption requests...</div>;
        if (error) return <div className="error-message">{error}</div>;
        if (!adoptionRequests.length) return <div>No adoption requests found.</div>;

        return (
            <div className="adopt-requests-section">
                <h2>Adoption Requests</h2>
                <div className="adopt-requests-grid">
                    {adoptionRequests.map((request) => (
                        <div key={request._id} className="adopt-request-card">
                            <div className="request-content">
                                <h3>{request.firstName} {request.lastName}</h3>
                                <p className="occupation">{request.occupation}</p>
                                <p className="pet-name">
                                    For: <strong>{request.petId?.name || 'Unknown Pet'}</strong>
                                </p>
                                <div className="status-section">
                                    <span className={`status-badge ${request.status}`}>
                                        {request.status}
                                    </span>
                                    {request.status === 'pending' && (
                                        <div className="action-buttons">
                                            <button 
                                                className="accept-btn"
                                                onClick={() => handleStatusUpdate(request._id, 'approved')}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="reject-btn"
                                                onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
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
                                    <div className="adopt-requests-grid">
                                        {loading ? (
                                            <div>Loading...</div>
                                        ) : (
                                            pets.map((pet) => {
                                                console.log('Individual pet data:', pet); // Debug log
                                                return (
                                                    <div key={pet._id} className="pet-card">
                                                        <div className="pet-image">
                                                            <img 
                                                                src={`http://localhost:5003${pet.photo}`}
                                                                alt={pet.name}
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '200px', 
                                                                    objectFit: 'cover',
                                                                    borderRadius: '8px 8px 0 0'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="pet-info">
                                                            <h3>{pet.name}</h3>
                                                            <p><strong>Type:</strong> {pet.type}</p>
                                                            <p><strong>Breed:</strong> {pet.breed}</p>
                                                            <p><strong>Age:</strong> {pet.age} years</p>
                                                            <p><strong>Gender:</strong> {pet.gender}</p>
                                                            <p><strong>Vaccinated:</strong> {pet.vaccinated ? 'Yes' : 'No'}</p>
                                                            <p>
                                                                <strong>Status: </strong>
                                                                <span className={`status-badge ${pet.status.toLowerCase()}`}>
                                                                    {pet.status}
                                                                </span>
                                                            </p>
                                                            <p className="description"><strong>Description:</strong> {pet.description}</p>
                                                            <div className="action-buttons">
                                                                <button 
                                                                    className="accept-btn"
                                                                    onClick={() => handleEdit(pet)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    className="reject-btn"
                                                                    onClick={() => handleDelete(pet._id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {activeTab === 'requests' && (
                                    renderAdoptRequests()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {showEditModal && editingPet && (
                    <EditPetModal
                        pet={editingPet}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingPet(null);
                        }}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        );
    } catch (error) {
        console.error('Error rendering CoordinatorAdoptionPage:', error);
        return <div>Error loading adoption page. Please try again.</div>;
    }
};

export default CoordinatorAdoptionPage;