import React from "react";
import Logo from "../Assets/logo.png";
import NotificationIcon from "../Assets/notification-icon.svg";
import Chaticon from "../Assets/chat-icon.svg";
import Avatar from "../Assets/account-circle-icon.svg";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navleft">
        <img src={Logo} alt="" className="logo" />
      </div>

      <div className="navright">
        <div className="chatNoti">
          <Link to="/notification">
            <img src={NotificationIcon} alt="" className="notiicon" />
          </Link>
          <img src={Chaticon} alt="" className="chaticon" />
        </div>
        <div className="propic">
          <Link to="/edit-profile">
            <img src={Avatar} alt="" className="avatar" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;