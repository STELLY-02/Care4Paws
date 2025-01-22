import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinUs.css';

const JoinUs = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/login');
  };

  return (
    <div className="joinus-page">
      <h1 className="joinus-title">Join Our Pet-Loving Community!</h1>
      <p className="joinus-paragraph">
        When we come together, we create a brighter future for animals. Be part of our community to:
        <ul>
          <li>Help reunite lost pets with their families.</li>
          <li>Find the perfect pet to adopt and welcome into your home.</li>
          <li>Connect with other pet lovers to share tips and experiences.</li>
          <li>Join local events and activities that celebrate pets.</li>
          <li>Earn rewards for your contributions to pet welfare initiatives.</li>
          <li>Learn essential pet care tips and tricks.</li>
          <li>Donate to make a meaningful impact.</li>
        </ul>
      </p>
      <div className="JoinUs_buttons">
        <button onClick={handleJoinClick}>Join As Member</button>
      </div>
      <div className="photo-container">
      </div>
    </div>
  );
};

export default JoinUs;