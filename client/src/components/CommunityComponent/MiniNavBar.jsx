import React from "react";
import "./MiniNavBar.css";

function MiniNavBar({ activeTab, setActiveTab }) {

  const role = localStorage.getItem('role');
  const feedTabs = [
  ];

  if (role === "user"){
    feedTabs.push(
      { id: "myFeed", text: "My Feed" },
      { id: "exploreCommunity", text: "Explore Community" },
      { id: "event", text: "Event" },
      { id: "livestream", text: "Livestream Now" },
    );
  }
    else if (role === "coordinator"){
      feedTabs.push(
        { id: "myPage", text: "My Page" },
        { id: "myEvent", text: "My Event" },
        { id: "myLivestream", text: "My Livestream" },
      );
    }
    

  return (
      <div className="NavTabs">
        {feedTabs.map((tab) => (
          <button
            key={tab.id}
            className={`NavTab ${activeTab === tab.id ? "activeTab" : "inactiveTab"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.text}
          </button>
          
        ))}
      </div>
  );
}

export default MiniNavBar;
