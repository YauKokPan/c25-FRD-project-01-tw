import "./FooterBar.css";

import React from "react";
import { Link } from "react-router-dom";
import { AuthGuard } from "../auth/AuthGuard";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

interface FooterBarProps {}

export const FooterBar: React.FC<FooterBarProps> = () => {
  const isAuth = AuthGuard();

  const links = [
    { path: "/", icon: HomeIcon },
    { path: "/hotels", icon: SearchIcon },
    { path: "/contact-us", icon: EmailIcon },
    {
      path: isAuth ? "/user-profile" : "/login",
      icon: isAuth ? PersonIcon : LoginIcon,
    },
  ];

  return (
    <div className="footer-bar">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.path} to={link.path} className="active-link">
            <Icon className="icon-size" />
          </Link>
        );
      })}
    </div>
  );
};
