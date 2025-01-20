import React, { useState, useEffect } from "react";
import { SidebarData } from "../../../components/SidebarData";
import { Link } from "react-router-dom";
import "../../Dashboard.css";
import Logo from "../../../assets/logo.png";
import NotificationIcon from "../../../assets/notification-icon.svg";
import Chaticon from "../../../assets/chat-icon.svg";
import Avatar from "../../../assets/account-circle-icon.svg";
import Cutepic from "../../../assets/Login Page.png";
import MoveInIcon from "../../../assets/arrow-back-icon.svg";
import MoveOutIcon from "../../../assets/arrow-forward-icon.svg";
import EventCard from '../../../components/CommunityComponent/EventCard'
import MiniNavBar from '../../../components/CommunityComponent/MiniNavBar'
//import SidebarAndNavbar from '../../../components/SidebarAndNavbar'
import MyFeed from "./UserMyFeed";
import ExploreCommunity from "./UserExploreCommunity";
import Event from "./UserEvent";
import "./UserCommunityPage.css"
import RecommendationBox from "../../../components/CommunityComponent/RecommendationBox";
import { fetchCoordinators, followUser, unfollowUser, fetchFollowedIds } from '../../../api';
import LiveStreamRouting from "../../../components/CommunityComponent/LiveStreamRouting"


function UserCommunityPage() {
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

const sidebarData = SidebarData("coordinator");

const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
};

//state to track which tab is active
const [activeTab, setActiveTab] = useState("myFeed");
//function to render the correct content based on activeTab
const renderTabContent = () => {
  switch (activeTab) {
    case "myFeed":
      return <MyFeed />;
    case "exploreCommunity":
      return <ExploreCommunity />;
    case "event":
      return <Event />;
    case "myLivestream":
      return <LiveStreamRouting />;
    default:
      return <div>Tab not found</div>;
  }
};

//handle recommendation box
const [recommendations, setRecommendations] = useState([]);
const [followedIds, setFollowedIds] = useState([]);

useEffect(() => {
  const getCoordinators = async () => {
    try {
      const coordinators = await fetchCoordinators();
      setRecommendations(coordinators);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  }; getCoordinators();
}, []);

useEffect(() => {
  const getFollowedIds = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const followedIds = await fetchFollowedIds(userId);
        console.log('Fetched followed IDs:', followedIds);
        setFollowedIds(followedIds);
        setRecommendations(prevRecommendations => 
          prevRecommendations.filter(recommendation => !followedIds.includes(recommendation._id))
        );
      
    } catch (error) {
      console.error("Error fetching followed users:", error);
    }
  };

  getFollowedIds();
}, []);

  const handleAdd = async (id) => {
    try {
      const userId = localStorage.getItem('userId'); // Get the current user's ID
      await followUser(userId, id, followedIds);
      console.log(`Followed user with id: ${id}`);
      setFollowedIds([...followedIds, id]); // Update the followedIds state
      setRecommendations(recommendations.filter(recommendation => recommendation._id !== id));

    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      const userId = localStorage.getItem('userId'); // Get the current user's ID
      await unfollowUser(userId, id);
      console.log(`Unfollowed user with id: ${id}`);
      setFollowedIds(followedIds.filter(followedId => followedId !== id)); // Update the followedIds state
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  

return (
    <div className="CoordinatorDashboard">
      <div className="navbar">
        <div className="navleft">
          <img src={Logo} alt="" className="logo" />
        </div>

        <div className="navright">
          <div className="chatNoti">
            <img src={NotificationIcon} alt="" className="notiicon" />
            <img src={Chaticon} alt="" className="chaticon" />
          </div>
          <div className="propic">
            <Link to="/edit-profile">
              <img src={Avatar} alt="" className="avatar" />
            </Link>
          </div>
        </div>
      </div>
      <div className="homebottom">
        <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul className="sidebarList">
            {sidebarData.map((val, key) => {
              return (
                <li
                  key={key}
                  className="sidebarRow"
                  // id={window.location.pathname == val.link ? "active " : ""}
                  onClick={() => {
                    window.location.pathname = val.link;
                  }}
                >
                  {" "}
                  <div id="sidebarIcon">{val.icon}</div>
                  {isSidebarOpen && <div id="sidebarTitle">{val.title}</div>}
                </li>
              );
            })}
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
          <div className="PageContent">
            <MiniNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="belowMNB">
            <div
              className="MainContainer"
              style={{
                width:
                  activeTab === "myFeed"
                    ? isSidebarOpen
                      ? '1100px'
                      : '1250px'
                    : isSidebarOpen
                        ? '1500px'
                        : '1650px'
              }}
            >
              <div className="TabContent">{renderTabContent()}</div>
            </div>
              {activeTab === "myFeed" && ( // Conditionally render SideContainer
              <div className="SideContainer">
                <div>
                <RecommendationBox
                  recommendations={recommendations}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  followedIds={followedIds}
                />                
                </div>
              </div>
            )}
          </div>
          </div>
      </div>
    </div>
  );
};

export default UserCommunityPage