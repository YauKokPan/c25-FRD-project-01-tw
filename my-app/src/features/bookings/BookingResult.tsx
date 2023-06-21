import React, { useState, useEffect, useMemo } from "react";
import { fetchUserData, removeBookingData } from "./bookingsAPI";
import "./BookingResult.css";
import "./Bookings.css";
import Swal from "sweetalert2";
import { getIsAdmin } from "../auth/authAPI";

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

  const isAdmin = getIsAdmin();

  const canCancelBooking = (startTime: Date): boolean => {
    const now = new Date();
    const twoDaysBeforeStartTime = new Date(startTime);
    twoDaysBeforeStartTime.setDate(twoDaysBeforeStartTime.getDate() - 2);

    return now <= twoDaysBeforeStartTime;
  };

  const isBookingPast = (endTime: Date): boolean => {
    const now = new Date();
    return now > endTime;
  };

  const handleDelete = async (bookingId: number, startTime: Date) => {
    if (!canCancelBooking(startTime)) {
      Swal.fire(
        "無法刪除！",
        "距離預約開始時間只剩兩天或更短，無法取消預約。",
        "error"
      );
      return;
    }
    const result = await Swal.fire({
      title: "確定要刪除這個預約嗎？",
      text: "此操作無法撤銷。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "是的，刪除它！",
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      await removeBookingData(bookingId);
      setUserData(userData.filter((booking) => booking.id !== bookingId));
      Swal.fire("已刪除！", "您的預約已被刪除。", "success");
    }
  };

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
        <div className="booking-result-div">
          {userData.map((booking) => (
            <li className="booking-result-li" key={booking.id}>
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
              <div className="booking-result-buttons">
                <button
                  onClick={() =>
                    handleDelete(booking.id, new Date(booking.start_time))
                  }
                  disabled={isBookingPast(new Date(booking.end_time))}
                >
                  刪除
                </button>
              </div>
            </li>
          ))}
        </div>
      ) : (
        <h5 className="no-booking">暫無預約紀錄</h5>
      )}
    </div>
  );
};

export default BookingResult;
