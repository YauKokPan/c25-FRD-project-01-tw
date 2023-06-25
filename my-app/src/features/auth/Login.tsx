import React from "react";
import { useState, FormEvent } from "react";
import "./Login.css";
import Title from "../title/Title";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { getIsAdmin, getUserId, localLogin } from "./authAPI";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Checkbox, FormControlLabel } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaRef = React.createRef<ReCAPTCHA>();

export default function Login() {
  const getRememberedEmail = () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    return rememberedEmail !== null ? rememberedEmail : "";
  };

  const [email, setEmail] = useState(getRememberedEmail());

  const [name] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [googleValue, setGoogleValue] = React.useState<string | null>("");
  const [captchaValue, captchaSetValue] = React.useState<string | null>(null);
  const [expired, setExpired] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // google reCAPTCHA
  const handleGoogleChange = (googleValue: string | null) => {
    console.log("Captcha value:", captchaValue);
    setGoogleValue(googleValue);

    // if value is null, recaptcha expired
    if (googleValue === null) {
      setExpired("true");
    }
  };

  const handleRecaptchaVerification = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (recaptchaRef.current) {
      const recaptchaValue = recaptchaRef.current.getValue();

      // Check the recaptchaValue and proceed with the handleSubmit if it's valid
      if (recaptchaValue) {
        handleSubmit();
        Swal.fire("登入成功！");
      } else {
        Swal.fire("recaptcha驗證失敗，請重試");
        setError("reCAPTCHA verification failed. Please try again.");
      }
    } else {
      Swal.fire("recaptcha驗證失敗，請重試");
      setError("reCAPTCHA verification failed. Please try again.");
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

    const userIdNum = Number(getUserId());
    const adminCheck = getIsAdmin();

    const result = await localLogin(
      userIdNum,
      name,
      email,
      password,
      adminCheck
    );
    if (email !== getRememberedEmail()) {
      localStorage.removeItem("rememberedEmail");
    }
    if (result) {
      dispatch(login(getUserId()));
      Swal.fire({
        title: "登入成功！",
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
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
            onChange={handleGoogleChange}
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
          {/* <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p> */}
        </form>
      </div>
    </div>
  );
}
