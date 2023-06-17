import React, { useState, useEffect } from "react";
import { Nav, Navbar, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MyNavbar.css";
import { useAppDispatch } from "../../app/hook";
import { Form, Button } from "react-bootstrap";
import { logout } from "../auth/authSlice";
import { AuthGuard } from "../auth/AuthGuard";
// import { useAppSelector } from "../../app/hook";
// import { IRootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { getUserName } from "../auth/authAPI";

export default function MyNavbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const username = useAppSelector((state: IRootState) => state.auth.username);
  const guardPage = AuthGuard();
  const [username, setUsername] = useState<string | null>("");

  // this state to manage the collapse state
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    setUsername(getUserName());
  }, [guardPage]);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/search?query=${searchQuery}`);
    setSearchQuery("");
  };

  // this function to close the navbar
  const closeNavbar = () => {
    setNavbarOpen(false);
  };

  return (
    <Navbar
      bg="bg"
      variant="light"
      className="my-navbar"
      sticky="top"
      expand="lg"
      expanded={navbarOpen}
    >
      <Nav.Link as={Link} to="/" onClick={closeNavbar} className="home-logo">
        <img
          src={process.env.PUBLIC_URL + "/img/logo.png"}
          alt="Company Logo"
        />
      </Nav.Link>

      <Navbar.Toggle
        onClick={() => setNavbarOpen(!navbarOpen)}
        aria-controls="navbarScroll"
        data-bs-target="#navbarScroll"
      />
      <Navbar.Collapse id="navbarScroll">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/" onClick={closeNavbar}>
            💋主頁
          </Nav.Link>
          <Nav.Link as={Link} to="/hotels" onClick={closeNavbar}>
            🏩酒店一覽
          </Nav.Link>
          <Nav.Link as={Link} to="/contact-us" onClick={closeNavbar}>
            💌聯絡我們
          </Nav.Link>
          <Form className="d-flex" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="輸入地區或酒店名"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button variant="outline-dark" type="submit" className="search-btn">
              搜尋
            </Button>
          </Form>
        </Nav>
        <Nav>
          {guardPage || [
            <Nav.Link key="login" as={Link} to="/login" onClick={closeNavbar}>
              💁‍♀️登入
            </Nav.Link>,
            <Nav.Link
              key="register"
              as={Link}
              to="/register"
              onClick={closeNavbar}
            >
              💁‍♂️註冊
            </Nav.Link>,
          ]}
        </Nav>
        {guardPage && (
          <Nav.Item>
            <Nav.Link as={Link} to="/user-profile" onClick={closeNavbar}>
              {username}
            </Nav.Link>
          </Nav.Item>
        )}
        {guardPage && (
          <Nav.Item>
            <Button
              variant="warning"
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              登出
            </Button>
          </Nav.Item>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
