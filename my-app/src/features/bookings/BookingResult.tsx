import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { fetchUserData } from "./bookingsAPI";
import "./BookingResult.css";
=======
import { fetchAllBookingData, fetchUserData } from "./bookingsAPI";
import "./Bookings.css";
>>>>>>> Stashed changes

export interface UserKey {
  name: string | undefined;
}

export interface HotelBookingKey {
  name: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  total_rooms: number | undefined;
}

export interface UserData {
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

const BookingResult: React.FC<{ userID: number }> = ({ userID }) => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // const bookingResponse = await fetchAllBookingData();

      const userResponse = await fetchUserData(Number(userID));
      const userData = await userResponse.json();

      // if (userData.length) {
      if (Array.isArray(userData)) {
        setUserData(userData);
      } else {
        console.error("userData is not an array:", userData);
        setUserData([]);
      }
    };

    fetchData();
  }, [userID]);

  return (
    <div className="bookingResult-container">
      <h1 className="bookingResult-title">預約紀錄</h1>
      {userData === null ? (
        <p>Loading...</p>
      ) : userData.length ? (
        <ul>
          {userData.map((booking) => (
            <li key={booking.id}>
              <h3>{booking.hotel_booking_key.name}</h3>
              <p>
                開始日期及時間: {new Date(booking.start_time).toLocaleString()}
              </p>
              <p>
                結束日期及時間: {new Date(booking.end_time).toLocaleString()}
              </p>
              <p>預約總時數: {booking.total_hours} 小時</p>
              <p>合計: {booking.total_price} 元</p>
              <p>電郵: {booking.booking_email}</p>
              <p>電話: {booking.booking_phone}</p>
            </li>
          ))}
        </ul>
      ) : (
        <h5 className="no-booking">暫無預約紀錄</h5>
      )}
    </div>
  );
};

export default BookingResult;
