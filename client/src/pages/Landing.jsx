import React from "react";
import "./Landing.css";
import About_Us from "../components/LandingComponent/About_Us/About_Us";
import WhatWeOffer from "../components/LandingComponent/WhatWeOffer/WhatWeOffer";
import Testimonials from "../components/LandingComponent/Testimonials/Testimonials";
import JoinUs from "../components/LandingComponent/JoinUs/JoinUs";
import ContactUs from "../components/LandingComponent/ContactUs/ContactUs";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Navigate to the login page
  };

  
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav>
          <ul className="nav-list">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
          <button className="login-button" onClick={handleLoginClick}>Login</button>
        </nav>
      </header>
      <main>
        <h1 className="main-title">Care4Paws</h1>
        <div className="buttons">
          <button>Find a Pet</button>
          <button>Report Lost</button>
          <button>Get Involved</button>
        </div>
        <div id="about">
          <About_Us />
        </div>
        <div id="services">
          <WhatWeOffer />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <div id="join">
          <JoinUs />
        </div>
        <div id="contact">
          <ContactUs />
        </div>
      </main>
    </div>
  );
};

export default Landing;