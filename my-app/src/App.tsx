import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import MyNavbar from "./features/navbar/MyNavbar";
import HotelList from "./features/hotel/HotelList";
import Login from "./features/auth/Login";
import Register from "./features/register/Register";
import ContactUs from "./features/contact/ContactUs";
import HotelDetail from "./features/hotel/HotelDetail";
import UserProfile from "./features/userProfile/UserProfile";
import HomePage from "./features/home/HomePage";
import SearchPage from "./features/searchPage/SearchPage";
import Payment from "./features/payment/Payment";
import Admin from "./features/admin/Admin";
import Footer from "./features/footer/Footer";
import FooterBar from "./features/footerBar/FooterBar";
import Demo from "./features/demo/Demo";

export default function App() {
  return (
    <>
      <MyNavbar />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/hotel-detail/:hotelId" element={<HotelDetail />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<h1>404 NOT FOUND!!!!</h1>} />
        </Routes>
        <Footer />
      </div>
      <FooterBar />
    </>
  );
}
