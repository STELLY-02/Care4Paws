import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/SidebarUser";
import MyPosts from "../components/Myposts";
import ReportPet from "../components/ReportPet";
import History from "../components/History";
import PetMatches from "../components/PetMatches"; // Import the PetMatches component
import "./LostAndFound.css"; // Import CSS for styling

const LostAndFound = ({ token }) => {
  const [activeTab, setActiveTab] = useState("All Pet"); // Track active tab
  const [hasMatches, setHasMatches] = useState(false); // Track whether matches exist

  // Render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "All Pet":
        return <MyPosts token={token} />;
      case "Report Pet":
        return <ReportPet token={token}/>;
      case "History":
        return <History token={token} />;
      case "Pet Matches":
        return (
          <PetMatches
            token={token}
            onMatchesUpdate={(matches) => setHasMatches(matches.length > 0)}
          />
        ); // Render the PetMatches component and update matches
      default:
        return null;
    }
  };

  return (
    <div className="lost-and-found-page">
      {/* Top Navbar */}
      <Navbar hasMatches={hasMatches} /> {/* Pass match status to Navbar */}
      {/* Bottom Section with Sidebar and Content */}
      <div className="lost-and-found-main">
        <Sidebar />

        <div className="content-container">
          {/* Tab Bar */}
          <div className="tab-bar">
            <button
              className={`tab-button ${
                activeTab === "All Pet" ? "active" : ""
              }`}
              onClick={() => setActiveTab("All Pet")}
            >
              All Pet
            </button>
            <button
              className={`tab-button ${
                activeTab === "Report Pet" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Report Pet")}
            >
              Report Pet
            </button>
            <button
              className={`tab-button ${
                activeTab === "History" ? "active" : ""
              }`}
              onClick={() => setActiveTab("History")}
            >
              History
            </button>
            <button
              className={`tab-button ${
                activeTab === "Pet Matches" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Pet Matches")}
            >
              Pet Matches
            </button>
          </div>

          {/* Render Content Based on Active Tab */}
          <div className="tab-content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default LostAndFound;
