import React from "react";
import "./Register.css";
import { useState, FormEvent } from "react";
import Title from "../title/Title";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "./registerAPI";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await registerAPI(name, email, password, phone);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="wrapper">
      <div className="register-form">
        <form onSubmit={handleSubmit}>
          <Title mainTitle="💁‍♂️註冊" />
          <div className="mb-3">
            <label>姓名</label>
            <input
              type="text"
              className="form-control"
              placeholder="請輸入名字"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="mb-3">
            <label>電郵地址</label>
            <input
              type="email"
              className="form-control"
              placeholder="請輸入電郵地址"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-3">
            <label>電話號碼</label>
            <input
              type="tel"
              pattern="[0-9]{8}"
              required
              className="form-control"
              placeholder="請輸入電話號碼"
              value={phone}
              onChange={handlePhoneChange}
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
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              註冊
            </button>
          </div>

          <p className="forgot-password text-right">
            Already registered <a href="/sign-in">sign in?</a>
          </p>
        </form>
      </div>
    </div>
  );
}
