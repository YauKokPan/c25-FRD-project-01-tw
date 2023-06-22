import React, { useState, useEffect } from "react";
import {
  fetchAllBookingData,
  fetchUserData,
  removeBookingData,
} from "./bookingsAPI";
import "./BookingResult.css";
import "./Bookings.css";
import Swal from "sweetalert2";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import { Hotel } from "../hotel/hotelAPI";
import emailjs from "@emailjs/browser";

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
  name: string;
  id: number;
  start_time: Date;
  end_time: Date;
  total_hours: number;
  total_prices: number;
  booking_email: string;
  booking_phone: string;
  remarks: string;
  user_booking_key: UserKey;
  hotel_booking_key: HotelBookingKey;
}

const BookingResult: React.FC<{ userID: number }> = ({ userID }) => {
  const [userData, setUserData] = useState<UserData[]>([]);

  const isAdmin = getIsAdmin();
  const userId = Number(getUserId());
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

  const sendEmail = (bookingData: any) => {
    emailjs
      .send(
        "service_0oq4smr",
        "template_oqws9wv",
        {
          hotel_name: bookingData.hotelname,
          user_name: bookingData.username,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          total_price: bookingData.totalPrice,
          booking_email: bookingData.email,
        },
        "ziPj-ay71jNqfVPJz"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
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
      text: "請注意：刪除了就無法回復，客服將會聯絡。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "是的，刪除它！",
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      setUserData(userData.filter((booking) => booking.id !== bookingId));
      Swal.fire("已刪除！", "您的預約已被刪除。", "success");
    }
    const response = await removeBookingData(bookingId);
    const cancelledBookingData: UserData = await response.json();
    console.log(cancelledBookingData);
    const bookingData = {
      hotel_name:
        cancelledBookingData.hotel_booking_key?.name ?? "Unknown hotel",
      user_name: cancelledBookingData.user_booking_key?.name ?? "Unknown user",
      booking_email: cancelledBookingData.booking_email,
      phone: cancelledBookingData.booking_phone,
      start_time: cancelledBookingData.start_time,
      end_time: cancelledBookingData.end_time,
      total_price: cancelledBookingData.total_prices,
    };
    console.log(bookingData);
    sendEmail(bookingData);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        const bookingResponse = await fetchAllBookingData();
        const userData = await bookingResponse.json();
        if (Array.isArray(userData)) {
          setUserData(userData);
        } else {
          console.error("userData is not an array:", userData);
          setUserData([]);
        }
      } else {
        const userResponse = await fetchUserData(Number(userID));
        const userData = await userResponse.json();
        if (Array.isArray(userData)) {
          setUserData(userData);
        } else {
          console.error("userData is not an array:", userData);
          setUserData([]);
        }
      }
    };
    fetchData();
  }, [isAdmin, userID]);

  return (
    <div className="bookingResult-container">
      <h1 className="bookingResult-title">預約紀錄</h1>
      {userData === null ? (
        <p>Loading...</p>
      ) : userData.length ? (
        <div className="booking-result-div">
          {userData.map((booking) => (
            <li className="booking-result-li" key={booking.id}>
              <h3>{booking.user_booking_key.name}</h3>
              <h3>{booking.hotel_booking_key.name}</h3>
              <p>
                開始日期及時間: {new Date(booking.start_time).toLocaleString()}
              </p>
              <p>
                結束日期及時間: {new Date(booking.end_time).toLocaleString()}
              </p>
              <p>預約總時數: {booking.total_hours} 小時</p>
              <p>合計: {booking.total_prices} 元</p>
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
