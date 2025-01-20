import React from "react";
import HomeIcon from "../Assets/home-icon.svg";
import AdoptIcon from "../Assets/adopt-icon.svg";
import LostAndFoundIcon from "../Assets/lost-pet-found-icon.png";
import CommunityIcon from "../Assets/community-icon.svg";
import EducationIcon from "../Assets/education-hub-icon.svg";
import DonationIcon from "../Assets/donation-icon.svg";

export const SidebarData = (role) => {
  console.log("current role:", role);
  const baseData = [
    {
      title: "Home",
      icon: <img src={HomeIcon} alt="Home Icon" className="icon" />,
      link:
        role === "user"
          ? "/user"
          : role === "coordinator"
          ? "/coordinator"
          : "/admin",
    },
  ];

  if (role === "user") {
    baseData.push(
      {
        title: "Discover Cute Pet",
        icon: <img src={AdoptIcon} alt="Adopt Icon" className="icon" />,
        link: "/user/adoption",
      },
      {
        title: "Lost and Found Corner",
        icon: (
          <img
            src={LostAndFoundIcon}
            alt="Lost and Found Icon"
            className="lostAndFoundIcon"
          />
        ),
        link: "/user/reportpet",
      },
      {
        title: "Explore Community",
        icon: <img src={CommunityIcon} alt="Community Icon" className="icon" />,
        link: "/user/community",
      },
      {
        title: "Be Pet Experts",
        icon: <img src={EducationIcon} alt="Education Icon" className="icon" />,
        link: "/user/be-pet-experts",
      },
      {
        title: "Donation",
        icon: <img src={DonationIcon} alt="Donation Icon" className="icon" />,
        link: "/user/donation",
      }
    );
  } else if (role === "coordinator") {
    baseData.push(
      {
        title: "Discover Cute Pet",
        icon: <img src={AdoptIcon} alt="Adopt Icon" className="icon" />,
        link: "/coordinator/adoption",
      },
      {
        title: "Lost and Found Corner",
        icon: (
          <img
            src={LostAndFoundIcon}
            alt="Lost and Found Icon"
            className="lostAndFoundIcon"
          />
        ),
        link: "/coordinator/reportpet",
      },
      {
        title: "Manage Your Community",
        icon: <img src={CommunityIcon} alt="Community Icon" className="icon" />,
        link: "/coordinator/community",
      },
      {
        title: "Be Pet Experts",
        icon: <img src={EducationIcon} alt="Education Icon" className="icon" />,
        link: "/coordinator/be-pet-experts",
      },
      {
        title: "Donation",
        icon: <img src={DonationIcon} alt="Donation Icon" className="icon" />,
        link: "/coordinator/donation",
      }
    );
  } else if (role === "admin") {
    baseData.push(
      {
        title: "Discover Cute Pet",
        icon: <img src={AdoptIcon} alt="Adopt Icon" className="icon" />,
        link: "/admin/home",
      },
      {
        title: "Lost and Found Corner",
        icon: (
          <img
            src={LostAndFoundIcon}
            alt="Lost and Found Icon"
            className="lostAndFoundIcon"
          />
        ),
        link: "/admin/home",
      },
      {
        title: "Explore Community",
        icon: <img src={CommunityIcon} alt="Community Icon" className="icon" />,
        link: "/admin/home",
      },
      {
        title: "Be Pet Experts",
        icon: <img src={EducationIcon} alt="Education Icon" className="icon" />,
        link: "/admin/be-pet-experts",
      },
      {
        title: "Donation",
        icon: <img src={DonationIcon} alt="Donation Icon" className="icon" />,
        link: "/admin/home",
      }
    );
  }

  return baseData;
};