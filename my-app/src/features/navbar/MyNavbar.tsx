import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import "./MyNavbar.css";
import { useAppDispatch } from "../../app/hook";
import { Button } from "react-bootstrap";
import { logout } from "../auth/authSlice";
import { AuthGuard } from "../auth/AuthGuard";
import { useAppSelector } from "../../app/hook";
import { IRootState } from "../../app/store";
import { useNavigate } from "react-router-dom";

export default function MyNavbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const username = useAppSelector((state: IRootState) => state.auth.username);
  const guardPage = AuthGuard();
  return (
    <Navbar bg="bg" variant="light" className="my-navbar" sticky="top">
      <img src={process.env.PUBLIC_URL + "/img/logo.png"} alt="Company Logo" />
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">
          主頁
        </Nav.Link>
        <Nav.Link as={Link} to="/hotels">
          搜尋酒店
        </Nav.Link>
        <Nav.Link as={Link} to="/contact-us">
          聯絡我們
        </Nav.Link>
      </Nav>
      <Nav>
        {guardPage || [
          <Nav.Link key="login" as={Link} to="/login">
            登入
          </Nav.Link>,
          <Nav.Link key="register" as={Link} to="/register">
            註冊
          </Nav.Link>,
        ]}
      </Nav>
      {guardPage && (
        <Nav.Item>
          <Nav.Link as={Link} to="/user-profile">
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
    </Navbar>
  );
}
