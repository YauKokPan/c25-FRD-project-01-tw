import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import MyNavbar from "./features/navbar/MyNavbar";
import HotelList from "./features/hotel/HotelList";
import Login from "./features/auth/Login";
import Register from "./features/register/Register";
import ContactUs from "./features/contact/ContactUs";
import HotelDetail from "./features/hotel/HotelDetail";

export default function App() {
  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<HotelList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/hotel-detail/:hotelId" element={<HotelDetail />} />
        {/* <Route path=":id" element={<HotelDetail />} /> */}

        <Route path="*" element={<h1>404 NOT FOUND!!!!</h1>} />
      </Routes>
    </>
  );
}
