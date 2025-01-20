import React, { useState, useEffect } from "react";
import "./ReportPet.css"; // Import styling
import { reportPet } from "../api";
import { jwtDecode } from "jwt-decode";  // Correct import

const ReportPet = () => {
  const [formData, setFormData] = useState({
    petName: "",
    petAge: "",
    petGender: "",
    petBreed: "",
    petColor: "",
    petType: "",
    bodySize: "",
    location: "",
    reportType: "Lost",
    description: "",
    photo: null, // Added for photo upload
  });

  const [previewUrl, setPreviewUrl] = useState(null); // For photo preview
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const [decodedToken, setDecodedToken] = useState(null);  // To store the decoded token

  // Fetch and decode token on mount
  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken); // Decode the token
          setDecodedToken(decoded);
        } catch (err) {
          setError("Invalid or expired token. Please log in again.");
        }
      } else {
        setError("You must be logged in to report a pet.");
      }
    };
    fetchToken();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));

      // Set preview URL for image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error("You must be logged in to report a pet.");
      }

      // Prepare form data for submission
      const petReportData = new FormData();
      petReportData.append("petName", formData.petName);
      petReportData.append("petAge", formData.petAge);
      petReportData.append("petGender", formData.petGender);
      petReportData.append("petBreed", formData.petBreed);
      petReportData.append("petColor", formData.petColor);
      petReportData.append("petType", formData.petType);
      petReportData.append("bodySize", formData.bodySize);
      petReportData.append("location", formData.location);
      petReportData.append("reportType", formData.reportType);
      petReportData.append("description", formData.description);

      // Only append photo if selected
      if (formData.photo) {
        petReportData.append("photo", formData.photo);
      }

      if (decodedToken) {
        petReportData.append("postedBy", JSON.stringify({
          id: decodedToken.id,
          username: decodedToken.username,
          role: decodedToken.role,
        }));
      }

      // Log form data for debugging
      console.log("Pet Report Data:", [...petReportData.entries()]);

      // Send request with token as authorization header
      const response = await reportPet(petReportData, token); // Pass the token here

      setNotification("Pet report submitted successfully!");
      setTimeout(() => setNotification(""), 5000);

      // Reset form after successful submission
      setFormData({
        petName: "",
        petAge: "",
        petGender: "",
        petBreed: "",
        petColor: "",
        petType: "",
        bodySize: "",
        location: "",
        reportType: "Lost",
        description: "",
        photo: null,
      });
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error submitting the pet report:", err);
      setError(err.message || "Error submitting pet report. Please try again.");
    }
  };

  return (
    <div className="report-pet-page">
      <div className="report-pet-container">
        <h1>Report Pet</h1>
        <form onSubmit={handleSubmit} className="report-pet-form" encType="multipart/form-data">
          <div className="form-fields">
            <div className="left-column">
              <input
                type="text"
                name="petName"
                placeholder="Pet Name"
                value={formData.petName}
                onChange={handleInputChange}
                required
                aria-label="Pet Name"
              />
              <input
                type="number"
                name="petAge"
                placeholder="Pet Age"
                value={formData.petAge}
                onChange={handleInputChange}
                required
                aria-label="Pet Age"
                min="0"
              />
              <input
                type="text"
                name="petGender"
                placeholder="Pet Gender"
                value={formData.petGender}
                onChange={handleInputChange}
                required
                aria-label="Pet Gender"
              />
              <input
                type="text"
                name="petBreed"
                placeholder="Pet Breed"
                value={formData.petBreed}
                onChange={handleInputChange}
                required
                aria-label="Pet Breed"
              />
              <input
                type="text"
                name="petColor"
                placeholder="Pet Colour (e.g., brown, white, black)"
                value={formData.petColor}
                onChange={handleInputChange}
                required
                aria-label="Pet Color"
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
                aria-label="Location"
              />
            </div>
            <div className="right-column">
              <input
                type="text"
                name="petType"
                placeholder="Pet Type (e.g., dog, cat)"
                value={formData.petType}
                onChange={handleInputChange}
                required
                aria-label="Pet Type"
              />
              <select
                name="bodySize"
                value={formData.bodySize}
                onChange={handleInputChange}
                required
                aria-label="Body Size"
              >
                <option value="">Select Body Size</option>
                <option value="small">Small</option>
                <option value="middle">Middle</option>
                <option value="big">Big</option>
              </select>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                required
                aria-label="Report Type"
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
              <textarea
                name="description"
                placeholder="Please briefly explain more information about your pet"
                value={formData.description}
                onChange={handleInputChange}
                required
                aria-label="Description"
              />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleInputChange}
                aria-label="Photo"
              />
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Pet Preview" />
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="submit-button">
            Submit Now!
          </button>
        </form>
        {notification && <p className="notification-message">{notification}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default ReportPet;
