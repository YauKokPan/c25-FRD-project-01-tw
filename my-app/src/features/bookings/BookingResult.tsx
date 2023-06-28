import React, { useState, useEffect } from "react";
import {
  fetchAllBookingData,
  fetchUserData,
  removeBookingData,
} from "./bookingsAPI";
import "./BookingResult.css";
import "./Bookings.css";
import Swal from "sweetalert2";
import { getIsAdmin } from "../auth/authAPI";
import emailjs from "@emailjs/browser";
import Button from "@mui/joy/Button";

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

  const canCancelBooking = (startTime: Date): boolean => {
    const now = new Date();
    const twoHoursBeforeStartTime = new Date(startTime);
    twoHoursBeforeStartTime.setHours(twoHoursBeforeStartTime.getHours() - 2);

    return now <= twoHoursBeforeStartTime;
  };

  const isBookingPast = (endTime: Date): boolean => {
    const now = new Date();
    return now > endTime;
  };

  const sendEmail = (bookingData: any) => {
    emailjs
      .send(
        "service_xzwqjem",
        "template_mo8dwss",
        {
          hotel_name: bookingData.hotel_name,
          user_name: bookingData.user_name,
          start_time: bookingData.start_time,
          end_time: bookingData.end_time,
          total_price: bookingData.total_price,
          booking_email: bookingData.booking_email,
        },
        "zR05TDXinfYiQDcCP"
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
        "無法取消！",
        "距離預約開始時間只剩兩小時或更短，無法取消預約。"
      );
      return;
    }
    const result = await Swal.fire({
      title: "確定要取消這個預約嗎？",
      text: "請注意：刪除後無法還原",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確認",
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      setUserData(userData.filter((booking) => booking.id !== bookingId));
      Swal.fire("已取消！", "已取消預約");
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
      start_time: new Date(cancelledBookingData.start_time).toLocaleString(),
      end_time: new Date(cancelledBookingData.end_time).toLocaleString(),
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
                <Button
                  onClick={() =>
                    handleDelete(booking.id, new Date(booking.start_time))
                  }
                  disabled={isBookingPast(new Date(booking.end_time))}
                >
                  取消預約
                </Button>
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
