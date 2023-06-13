// src/BookingResult.tsx

import React, { useState, useEffect } from "react";
import { fetchAllBookingData, fetchUserData } from "./bookingsAPI";
import { getUserId } from "../auth/authAPI";

interface BookingResultProps {
  hotel_id: number;
}

interface UserKey {
  name: string | undefined;
}

interface HotelBookingKey {
  name: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  total_rooms: number | undefined;
}

interface UserData {
  id: number;
  start_time: Date;
  end_time: Date;
  total_hours: number;
  total_price: number;
  booking_email: string;
  booking_phone: string;
  remarks: string;
  user_booking_key: UserKey;
  hotel_booking_key: HotelBookingKey;
}

const userID = Number(getUserId());

const BookingResult: React.FC = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const bookingResponse = await fetchAllBookingData();

      const userResponse = await fetchUserData(userID);
      const userData = await userResponse.json();

      setUserData(userData);
    };

    fetchData();
  }, [userID]);
  return (
    <div>
      <h2>Booking Results</h2>
      <ul>
        {userData.map((booking) => (
          <li key={booking.id}>
            <h3>{booking.user_booking_key.name}</h3>
            <h3>{booking.hotel_booking_key.name}</h3>
            <p>
              開始日期及時間: {new Date(booking.start_time).toLocaleString()}
            </p>
            <p>完結日期及時間: {new Date(booking.end_time).toLocaleString()}</p>
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
