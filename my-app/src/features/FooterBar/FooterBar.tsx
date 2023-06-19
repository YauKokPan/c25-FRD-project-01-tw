import React from "react";
import { NavLink } from "react-router-dom";
import "./FooterBar.css";
import { AuthGuard } from "../auth/AuthGuard";

interface FooterBarProps {
  isAuth: boolean;
}

const FooterBar: React.FC<FooterBarProps> = () => {
  const isAuth = AuthGuard();
  return (
    <div className="footer-bar">
      <NavLink to="/" className="active-link">
        HomePage
      </NavLink>
      <NavLink to="/hotels" className="active-link">
        HotelList
      </NavLink>
      <NavLink to="/contact-us" className="active-link">
        ContactUs
      </NavLink>
      <NavLink to={isAuth ? "/user-profile" : "/login"} className="active-link">
        {isAuth ? "UserProfile" : "Login"}
      </NavLink>
    </div>
  );
};

export default FooterBar;
