import React, { useState } from "react";
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
    default:
      return <div>Tab not found</div>;
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
                  <RecommendationBox />
                  <RecommendationBox />
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