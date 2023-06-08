import React from "react";
import "./ContactUs.css";
import { useState, FormEvent } from "react";
import Title from "../title/Title";
import { useNavigate } from "react-router-dom";
import { contactUsAPI } from "./contactUsAPI";
import emailjs from '@emailjs/browser';

export default function ContactUs() {
  const navigate = useNavigate();
  const [contact_name, setContact_name] = useState("");
  const [contact_email, setContact_email] = useState("");
  const [contact_phone, setContact_phone] = useState("");
  const [contact_message, setContact_message] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact_name(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact_email(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact_phone(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContact_message(event.target.value);
  };

  const sendEmail = (formData: Record<string, unknown> | undefined) => {
    emailjs
      .send(
        "service_lmytsyp",
        "template_tsi6b48",
        formData,
        "RNXy4IKK-6Gbe5PCe"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("Email sent successfully!");
        },
        (error) => {
          console.log(error.text);
          alert("Error sending email: " + error.message);
        }
      );

  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await contactUsAPI(
      contact_name,
      contact_email,
      contact_phone,
      contact_message
    );
    if (result) {
      const formData = {
        user_name: contact_name,
        user_email: contact_email,
        user_phone: contact_phone,
        message: contact_message,
      };
      sendEmail(formData);
      navigate("/");
      alert("成功提交");
    }
  };

  return (
    <>
      <div className="contactus-background">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <Title mainTitle="聯絡我們" />

            <div className="mb-3">
              <label>姓名</label>
              <input
                type="text"
                className="form-control"
                placeholder="請輸入名字"
                name="user_name"
                value={contact_name}
                onChange={handleNameChange}
              />
            </div>

            <div className="mb-3">
              <label>電郵地址</label>
              <input
                type="email"
                className="form-control"
                placeholder="請輸入電郵地址"
                name="user_email"
                value={contact_email}
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
                name="user_phone"
                value={contact_phone}
                onChange={handlePhoneChange}
              />
            </div>

            <div className="mb-3">
              <label>Message</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="給我們的訊息"
                name="message"
                value={contact_message}
                onChange={handleMessageChange}
              />
            </div>
            <div className="d-grid">
              <center>
                <button
                  type="submit"
                  className="btn btn-primary contactus-button"
                >
                  提交
                </button>
              </center>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}