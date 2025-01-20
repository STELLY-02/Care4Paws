import React, { useState, useEffect } from "react";
import { getUserReports, markLostAsFound } from "../api";
import { jwtDecode } from "jwt-decode"; // Fix import statement
import "./History.css"; // Add CSS for styling

const History = () => {
  const BASE_URL = "http://localhost:8085";
  const [lostReports, setLostReports] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track image loading errors

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
        setError("You must be logged in to view your lost pet reports.");
      }
    };
    fetchToken();
  }, []);

  // Fetch user-specific lost pet reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      try {
        const response = await getUserReports(token); // Pass the token to the API
        setLostReports(response.lostReports || []);
      } catch (err) {
        setError(err.message || "Failed to fetch lost pet reports.");
      }
    };
    fetchReports();
  }, [token]);

  // Handle image errors
  const handleImageError = (reportId) => {
    setImageErrors((prev) => ({
      ...prev,
      [reportId]: true,
    }));
  };

  // Mark a lost pet as found
  const handleMarkAsFound = async (reportId) => {
    try {
      if (!token) throw new Error("You must be logged in to perform this action.");
      await markLostAsFound(reportId, token);
      setLostReports((prevReports) =>
        prevReports.filter((report) => report._id !== reportId)
      );
    } catch (err) {
      setError("Failed to mark the report as found. Please try again.");
    }
  };

  // Get the full image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    return photoPath.startsWith("http") ? photoPath : `${BASE_URL}/${photoPath}`;
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="history-container">
      <h2>Lost Pet Reports</h2>
      {decodedToken && (
        <p>
          Welcome, <strong>{decodedToken.username || "User"}</strong>!
        </p>
      )}
      {lostReports.length === 0 ? (
        <p>No lost reports found. You haven't reported any lost pets.</p>
      ) : (
        <ul className="report-list">
          {lostReports.map((report) => (
            <li key={report._id} className="report-item">
              <div className="report-photo">
                {report.photo && !imageErrors[report._id] ? (
                  <img
                    src={getImageUrl(report.photo)}
                    alt={report.petName || "Pet"}
                    className="pet-photo"
                    onError={() => handleImageError(report._id)}
                  />
                ) : (
                  <div className="photo-placeholder">No photo available</div>
                )}
              </div>
              <div className="report-details">
                <strong>Pet Name:</strong> {report.petName || "Unknown"}
                <br />
                <strong>Age:</strong> {report.petAge || "Unknown"}
                <br />
                <strong>Gender:</strong> {report.petGender || "Unknown"}
                <br />
                <strong>Location:</strong> {report.location || "Unknown"}
                <br />
                <strong>Description:</strong> {report.description || "No description available"}
                <br />
                {report.postedBy.id === decodedToken.id && (
                  <button
                    className="mark-as-found-button"
                    onClick={() => handleMarkAsFound(report._id)}
                  >
                    Mark as Found
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
