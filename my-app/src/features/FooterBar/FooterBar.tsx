// FooterBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="footer-bar">
      <Link to="/" className="active-link" onClick={() => handleLinkClick("/")}>
        <HomeIcon className="icon-size" />
      </Link>
      <Link
        to="/hotels"
        className="active-link"
        onClick={() => handleLinkClick("/hotels")}
      >
        <SearchIcon className="icon-size" />
      </Link>
      <Link
        to="/contact-us"
        className="active-link"
        onClick={() => handleLinkClick("/contact-us")}
      >
        <EmailIcon className="icon-size" />
      </Link>
      <Link
        to={isAuth ? "/user-profile" : "/login"}
        className="active-link"
        onClick={() => handleLinkClick(isAuth ? "/user-profile" : "/login")}
      >
        {isAuth ? (
          <PersonIcon className="icon-size" />
        ) : (
          <LoginIcon className="icon-size" />
        )}
      </Link>
    </div>
  );
};

export default FooterBar;
