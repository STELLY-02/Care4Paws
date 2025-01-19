import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdoptionForm.css';

const AdoptionForm = ({ pet, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        occupation: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData?.email) {
            setFormData(prev => ({
                ...prev,
                email: userData.email
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!/^\d{8,}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be at least 8 digits';
        }
        if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first');
                return;
            }

            const url = `http://localhost:5003/api/adopt/${pet._id}/submit`;
            console.log('Submitting adoption form to:', url);

            const requestData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                occupation: formData.occupation
            };

            const response = await axios.post(
                url,
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Adoption form submitted successfully:', response.data);
            
            // Show success message to user
            alert('Adoption form submitted successfully!');
            
            // Clear form and close
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                contactNumber: '',
                occupation: ''
            });
            
            // Call onSubmit and onClose callbacks
            onSubmit && onSubmit();
            onClose && onClose();
            
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                console.error('Server error:', error.response.data);
                alert(error.response.data.error || 'Failed to submit adoption form');
            } else if (error.request) {
                // Request was made but no response
                console.error('No response from server');
                alert('No response from server. Please try again.');
            } else {
                // Error in request setup
                console.error('Request error:', error.message);
                alert('Error submitting form. Please try again.');
            }
        }
    };

    const handleContactCoordinator = () => {
        // You can implement the contact functionality here
        // For now, let's just show an alert
        alert('Contact coordinator functionality will be implemented soon!');
    };

    return (
        <div className="adoption-form-overlay">
            <div className="adoption-form-container">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Adoption Application Form</h2>
                <p className="pet-name">for {pet?.name}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'error' : ''}
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'error' : ''}
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="readonly-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className={errors.contactNumber ? 'error' : ''}
                        />
                        {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="occupation">Occupation</label>
                        <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className={errors.occupation ? 'error' : ''}
                        />
                        {errors.occupation && <span className="error-message">{errors.occupation}</span>}
                    </div>

                    <div className="button-group">
                        <button 
                            type="button" 
                            className="contact-button"
                            onClick={handleContactCoordinator}
                        >
                            Contact Coordinator
                        </button>
                        <button type="submit" className="submit-button">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdoptionForm;
