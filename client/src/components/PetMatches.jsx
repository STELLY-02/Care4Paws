import React, { useEffect, useState } from "react";
import { getMatches, sendNotificationToOwner } from "../api";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PetMatches.css"; // Add CSS for side-by-side styling

const PetMatches = () => {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8085";
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    return photoPath.startsWith("http")
      ? photoPath
      : `${BASE_URL}/${photoPath.replace(/^\/+/g, "")}`;
  };

  const handleImageError = (matchId) => {
    setImageErrors((prev) => ({
      ...prev,
      [matchId]: true,
    }));
  };

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const decoded = jwtDecode(storedToken);
          setDecodedToken(decoded);
        } catch (err) {
          setError("Invalid or expired token. Please log in again.");
        }
      } else {
        setError("You must be logged in to view pet matches.");
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const matchData = await getMatches(token);
        if (matchData && matchData.length > 0) {
          setMatches(matchData);
          toast.info("Matches fetched successfully!");
        } else {
          toast.info("No matches found.");
        }
      } catch (err) {
        setError("Failed to fetch matches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  const handleViewDetails = (match) => {
    setSelectedMatch(match);
  };

  const handleCloseModal = () => {
    setSelectedMatch(null);
  };

  if (loading) return <div>Loading matches...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="pet-matches-container">
      <h2>Pet Matches</h2>
      {decodedToken && (
        <p>
          Welcome, <strong>{decodedToken.username || "User"}</strong>!
        </p>
      )}
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        <div className="matches-list">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <h3>{match.lostPetName || "Lost Pet"}</h3>
              <div className="photos-container">
                <div className="photo-wrapper">
                  <h4>Lost Pet Photo</h4>
                  {match.lostPetPhoto && !imageErrors[match.id] ? (
                    <img
                      src={getImageUrl(match.lostPetPhoto)}
                      alt={`Lost pet ${match.lostPetName}`}
                      onError={() => handleImageError(match.id)}
                      className="pet-photo"
                    />
                  ) : (
                    <div className="photo-placeholder">No photo available</div>
                  )}
                </div>
                <div className="photo-wrapper">
                  <h4>Found Pet Photo</h4>
                  {match.foundPetPhoto && !imageErrors[match.id] ? (
                    <img
                      src={getImageUrl(match.foundPetPhoto)}
                      alt="Found pet"
                      onError={() => handleImageError(match.id)}
                      className="pet-photo"
                    />
                  ) : (
                    <div className="photo-placeholder">No photo available</div>
                  )}
                </div>
              </div>
              <button onClick={() => handleViewDetails(match)}>View Details</button>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h2>Found Pet Details</h2>
            <div className="modal-details">
              {selectedMatch.foundPetPhoto && !imageErrors[selectedMatch.id] ? (
                <img
                  src={getImageUrl(selectedMatch.foundPetPhoto)}
                  alt="Found pet"
                  onError={() => handleImageError(selectedMatch.id)}
                  className="modal-photo"
                />
              ) : (
                <div className="photo-placeholder">No photo available</div>
              )}
              <div className="pet-details">
                <p><strong>Breed:</strong> {selectedMatch.foundPetBreed || "Unknown"}</p>
                <p><strong>Gender:</strong> {selectedMatch.foundPetGender || "Unknown"}</p>
                <p><strong>Location:</strong> {selectedMatch.foundPetLocation || "Unknown"}</p>
                <p><strong>Description:</strong> {selectedMatch.foundPetDescription || "No description available"}</p>
                <p><strong>Match Confidence:</strong> {selectedMatch.confidence}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PetMatches;
