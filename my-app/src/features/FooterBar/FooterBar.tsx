import React from "react";
import { NavLink } from "react-router-dom";
import "./FooterBar.css";
import { AuthGuard } from "../auth/AuthGuard";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

interface FooterBarProps {
  isAuth: boolean;
}

const FooterBar: React.FC<FooterBarProps> = () => {
  const isAuth = AuthGuard();
  return (
    <div className="footer-bar">
      <NavLink to="/" className="active-link">
        <HomeIcon />
      </NavLink>
      <NavLink to="/hotels" className="active-link">
        <SearchIcon />
      </NavLink>
      <NavLink to="/contact-us" className="active-link">
        <EmailIcon />
      </NavLink>
      <NavLink to={isAuth ? "/user-profile" : "/login"} className="active-link">
        {isAuth ? <PersonIcon /> : <LoginIcon />}
      </NavLink>
    </div>
  );
};

export default FooterBar;
