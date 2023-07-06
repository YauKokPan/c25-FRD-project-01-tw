import "./Login.css";

import React, { useState, FormEvent } from "react";
import Title from "../title/Title";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { getUserId, localLogin } from "./authAPI";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Checkbox, FormControlLabel } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

const getRememberedEmail = () => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  return rememberedEmail ?? "";
};

interface LoginError {
  email: string | null;
  password: string | null;
}

export default function Login() {
  const recaptchaRef = React.createRef<ReCAPTCHA>();

  const [email, setEmail] = useState(getRememberedEmail());

  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<LoginError>({
    email: null,
    password: null,
  });

  const handleRecaptchaVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (recaptchaRef.current) {
      const recaptchaValue = recaptchaRef.current.getValue();
      // Check the recaptchaValue and proceed with the handleSubmit if it's valid
      if (recaptchaValue) {
        handleSubmit();
      } else {
        Swal.fire("recaptcha驗證失敗，請重試");
      }
    } else {
      Swal.fire("recaptcha驗證失敗，請重試");
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
      setIsSubmitting(true);
    } else {
      Swal.fire("登入失敗！");
    }

    if (email === "") {
      setError((state) => ({ ...state, email: "invalid email" }));
      return;
    } else if (password === "") {
      setError((state) => ({ ...state, password: "invalid password" }));
      return;
    }

    const result = await localLogin("", email, password);
    if (email !== getRememberedEmail()) {
      localStorage.setItem("rememberedEmail", email);
    }

    if (result) {
      dispatch(login(getUserId() + ""));
      Swal.fire({ title: "登入成功！", timer: 2000 });
      setTimeout(() => navigate("/"), 2000);
    } else {
      Swal.fire({
        title: "登入失敗！",
        text: "電郵或密瑪錯誤",
        timer: 2000,
      });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setRememberMe(isChecked);

    if (isChecked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  };

  return (
    <div className="wrapper">
      <div className="login-form">
        <form onSubmit={handleRecaptchaVerification}>
          <Title mainTitle="💁‍♀️登入" />
          <div className="mb-3">
            <label>電郵</label>
            <input
              type="email"
              className="form-control"
              placeholder="請輸入電郵"
              value={email}
              onChange={handleEmailChange}
            />
            {error.email && <p>{error.email}</p>}
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
            {error.password && <p>{error.password}</p>}
          </div>

          <div className="mb-3">
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              }
              label="記住登入電郵"
            />
          </div>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdF9owmAAAAAIil4OgvbkKJQwW-0yY5UAr-PcVE"
            className="responsive-recaptcha"
          />

          <div className="d-grid">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
