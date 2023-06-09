import React from "react";
import { useState, FormEvent } from "react";
import "./Login.css";
import Title from "../title/Title";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { localLogin } from "./authAPI";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await localLogin(name, email, password);
    if (result) {
      dispatch(login(email));
      setSuccessMessage("Login successful");
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className="wrapper">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <Title mainTitle="💁‍♀️登入" />
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <div className="mb-3">
            <label>電郵</label>
            <input
              type="email"
              className="form-control"
              placeholder="請輸入電郵"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-3">
            <label>密碼</label>
            <input
              type="password"
              className="form-control"
              placeholder="請輸入密碼"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              登入
            </button>
          </div>
          {/* <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p> */}
        </form>
      </div>
    </div>
  );
}