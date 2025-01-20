import React from "react";
import HomeIcon from "../Assets/home-icon.svg";
import AdoptIcon from "../Assets/adopt-icon.svg";
import LostAndFoundIcon from "../Assets/lost-pet-found-icon.png";
import CommunityIcon from "../Assets/community-icon.svg";
import EducationIcon from "../Assets/education-hub-icon.svg";
import DonationIcon from "../Assets/donation-icon.svg";

export const SidebarDataU = [
  {
    title: "Home",
    icon: <img src={HomeIcon} alt="Home" className="sidebar-icon" />,
    link: "/user",
  },
  {
    title: "Discover Cute Pet",
    icon: <img src={AdoptIcon} alt="Discover Cute Pet" className="sidebar-icon" />,
    link: "/user",
  },
  {
    title: "Lost and Found Corner",
    icon: <img src={LostAndFoundIcon} alt="Lost and Found" className="sidebar-icon" />,
    link: "/user/reportpet",
  },
  {
    title: "Explore Community",
    icon: <img src={CommunityIcon} alt="Explore Community" className="sidebar-icon" />,
    link: "/user",
  },
  {
    title: "Be Pet Experts",
    icon: <img src={EducationIcon} alt="Be Pet Experts" className="sidebar-icon" />,
    link: "user/be-pet-experts",
  },
  {
    title: "Donation",
    icon: <img src={DonationIcon} alt="Donation" className="sidebar-icon" />,
    link: "user/donation",
  },
];
