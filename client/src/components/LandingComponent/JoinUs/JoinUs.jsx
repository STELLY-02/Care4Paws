import React from 'react';
import './JoinUs.css';

const JoinUs = () => {
  return (
    <div className="joinus-page">
      <h1 className="joinus-title">Join Our Pet-Loving Community!</h1>
      <p className="joinus-paragraph">
        When we come together, we create a brighter future for animals. Be part of our community to:
        <ul className="joinus-list">
          <li>1. Help reunite lost pets with their families.</li>
          <li>2. Find the perfect pet to adopt and welcome into your home.</li>
          <li>3. Connect with other pet lovers to share tips and experiences.</li>
          <li>4. Join local events and activities that celebrate pets.</li>
          <li>5. Earn rewards for your contributions to pet welfare initiatives.</li>
          <li>6. Learn essential pet care tips and tricks.</li>
          <li>7. Donate to make a meaningful impact.</li>
        </ul>
      </p>
      <div className="JoinUs_buttons">
        <button>Join As Member</button>
      </div>
      <div className="photo-container">
      </div>
    </div>
  );
};

export default JoinUs;