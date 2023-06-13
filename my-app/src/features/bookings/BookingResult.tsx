// src/BookingResult.tsx

import React, { useState, useEffect } from "react";
import {
  fetchAllBookingData,
  fetchUserData,
  fetchHotelData,
} from "./bookingsAPI";
import { useParams } from "react-router-dom";

interface BookingResultProps {
  userID: number;
  hotel_id: number;
}

interface BookingData {
  id: number;
  hotel_name: string;
  start_time: Date;
  end_time: Date;
  total_hours: number;
  total_price: number;
  booking_email: string;
  booking_phone: string;
}

const BookingResult: React.FC<BookingResultProps> = ({ userID, hotel_id }) => {
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [hotelName, setHotelName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const bookingResponse = await fetchAllBookingData();
      const bookingData = await bookingResponse.json();

      const userResponse = await fetchUserData(userID);
      const userData = await userResponse.json();

      const hotelResponse = await fetchHotelData(hotel_id);
      const hotelData = await hotelResponse.json();

      setBookingData(bookingData);
      setUserName(userData.name); // Assuming the user data has a 'name' property
      setHotelName(hotelData.name); // Assuming the hotel data has a 'name' property
    };

    fetchData();
  }, [userID, hotel_id]);
  return (
    <div>
      <h2>Booking Results</h2>
      <ul>
        {bookingData.map((booking) => (
          <li key={booking.id}>
            <h3>{userName}</h3>
            <h3>{hotelName}</h3>
            <p>開始日期及時間: {booking.start_time.toLocaleString()}</p>
            <p>完結日期及時間: {booking.end_time.toLocaleString()}</p>
            <p>預約總時數為: {booking.total_hours} 小時</p>
            <p>需付金額: {booking.total_price} 元</p>
            <p>預約者電郵: {booking.booking_email}</p>
            <p>預約者電話: {booking.booking_phone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingResult;
