import React from 'react';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import MyNavbar from './components/MyNavbar';
import HotelList from './components/HotelList';
import Login from './components/Login';
import Register from './components/Register';
import ContactUs from './components/ContactUs';
import HotelDetail from './components/HotelDetail';

export default function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<HotelList/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/contact-us" element={<ContactUs/>}/>

        <Route path="/hotel-detail" element={<HotelDetail/>}>
          <Route path=":id" element={<HotelDetail/>}/>
        </Route>
        <Route path="*" element={<h1>404 NOT FOUND!!!!</h1>}/>
      </Routes>
    </BrowserRouter>
  )
}