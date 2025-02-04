import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import "./UserAdoptionPage.css";
import Navbar from '../../../components/Navbar';
import { SidebarData } from '../../../components/SidebarData';
import Cutepic from "../../../assets/Login Page.png";
import MoveInIcon from "../../../assets/arrow-back-icon.svg";
import MoveOutIcon from "../../../assets/arrow-forward-icon.svg";
import CrossIcon from "../../../assets/cross-icon.png";
import HeartIcon from "../../../assets/love-icon.png";
import AdoptionForm from './AdoptionForm';

const UserAdoptionPage = () => {
  const [currentTab, setCurrentTab] = useState("All Pets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8085/api/pets', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        if (Array.isArray(response.data)) {
          setAnimals(response.data);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching pets:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch pets');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePass = () => {
    setCurrentPetIndex((prevIndex) => {
      if (prevIndex >= animals.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handleLike = (pet) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to adopt pets');
      navigate('/login');
      return;
    }

    if (pet.status !== 'available') {
      alert('Sorry, this pet is currently not available for adoption.');
      return;
    }

    setSelectedPet(pet);
    setShowAdoptionForm(true);
  };

  const handleAdoptClick = (pet) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to adopt a pet');
      navigate('/login');
      return;
    }

    if (pet.status === 'pending' || pet.status === 'adopted') {
      alert('Sorry, this pet is currently not available for adoption as it is under application process.');
      return;
    }

    setSelectedPet(pet);
    setShowAdoptionForm(true);
  };

  const renderSwipeMatch = () => {
    if (!Array.isArray(animals) || animals.length === 0) {
      return <div className="no-pets">No pets available for matching</div>;
    }

    const currentPet = animals[currentPetIndex];

    return (
      <div className="swipe-container">
        <div className="pet-card">
          <img 
            src={`http://localhost:8085${currentPet.photo}`}
            alt={currentPet.name}
            className="pet-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-pet-image.jpg';
            }}
          />
          <div className="pet-info">
            <h2>{currentPet.name}</h2>
            <p><strong>Age:</strong> {currentPet.age}</p>
            <p><strong>Breed:</strong> {currentPet.breed}</p>
            <p><strong>Vaccinated:</strong> {currentPet.vaccinated ? 'Yes' : 'No'}</p>
            <p><strong>Description:</strong> {currentPet.description}</p>
          </div>
          <div className="swipe-buttons">
            <button 
              className="pass-button"
              onClick={handlePass}
              aria-label="Pass"
            >
              <img src={CrossIcon} alt="Pass" className="button-icon" />
            </button>
            <button 
              className={`like-button ${currentPet.status !== 'available' ? 'disabled' : ''}`}
              onClick={() => handleLike(currentPet)}
              disabled={currentPet.status !== 'available'}
              aria-label="Like"
            >
              <img src={HeartIcon} alt="Like" className="button-icon" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading pets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Adoption">
      <Navbar />
      <div className="homebottom">
        <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul className="sidebarList">
            {Array.isArray(SidebarData) && SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  {isSidebarOpen && <span className="title">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="sidebarBottom">
            {isSidebarOpen && (
              <img src={Cutepic} alt="" className="sidebarBottomImage" />
            )}
          </div>
          <div
            className="sidebarToggle"
            onClick={toggleSidebar}
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <img
              src={isSidebarOpen ? MoveInIcon : MoveOutIcon}
              alt="Toggle Sidebar"
            />
          </div>
        </div>
        <div className="main-content">
          <div className="tab-navigation">
            <button
              className={currentTab === "Swipe/Match" ? "active" : ""}
              onClick={() => setCurrentTab("Swipe/Match")}
            >
              Swipe/Match
            </button>
            <button
              className={currentTab === "All Pets" ? "active" : ""}
              onClick={() => setCurrentTab("All Pets")}
            >
              All Pets
            </button>
          </div>

          {currentTab === "Swipe/Match" ? (
            renderSwipeMatch()
          ) : (
            <div className="all-pets">
              {Array.isArray(animals) && animals.length > 0 ? (
                animals.map((animal, index) => (
                  <div key={index} className="pet-box">
                    <img 
                      src={`http://localhost:8085${animal.photo}`} 
                      alt={animal.name} 
                      className="pet-photo" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-pet-image.jpg';
                      }}
                    />
                    <div className="pet-details">
                      <p><strong>Name:</strong> {animal.name}</p>
                      <p><strong>Age:</strong> {animal.age}</p>
                      <p><strong>Gender:</strong> {animal.gender}</p>
                      <p><strong>Breed:</strong> {animal.breed}</p>
                      <p><strong>Vaccinated:</strong> {animal.vaccinated ? 'Yes' : 'No'}</p>
                      <p><strong>Description:</strong> {animal.description}</p>
                      <button 
                        className={`adopt-button ${animal.status !== 'available' ? 'disabled' : ''}`}
                        onClick={() => handleAdoptClick(animal)}
                        disabled={animal.status !== 'available'}
                      >
                        {animal.status === 'available' ? 'Adopt Me' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>No pets available at the moment.</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {showAdoptionForm && selectedPet && (
        <AdoptionForm 
          pet={selectedPet}
          onClose={() => {
            setShowAdoptionForm(false);
            setSelectedPet(null);
          }}
        />
      )}
    </div>
  );
};

export default UserAdoptionPage;