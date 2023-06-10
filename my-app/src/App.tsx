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
// import Bookings from "./features/bookings/Bookings";
import HomePage from "./features/home/HomePage";
import SearchPage from "./features/searchPage/SearchPage";
// import "./ionic";

export default function App() {
  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/hotel-detail/:hotelId" element={<HotelDetail />} />
        <Route path="/user-profile" element={<UserProfile />} />
        {/* <Route path="/bookings" element={<Bookings />} /> */}
        <Route path="/search" element={<SearchPage />} />

        <Route path="*" element={<h1>404 NOT FOUND!!!!</h1>} />

        {/* <Route path=":id" element={<HotelDetail />} /> */}
      </Routes>
    </>
  );
}
