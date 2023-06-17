import React, { useState, useEffect } from "react";
import { fetchUserData } from "../bookings/bookingsAPI";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { getUserId } from "../auth/authAPI";
import { UserData } from "../bookings/BookingResult";
import "./Payment.css";

const userID = Number(getUserId());

export default function Payment() {
  const [bookingInfo, setBookingInfo] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUserData(userID);
      const userLatestBooking = await response.json();
      setBookingInfo(userLatestBooking[0]);
    };
    fetchData();
  }, []);

  const options = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
  };

  return (
    <div className="payment-container">
      {bookingInfo ? (
        <div className="payment-info-container">
          <h2 className="payment-heading">請確認以下資料與付款：</h2>
          <div className="booking-info">
            <p>
              <strong>預訂人姓名:</strong> {bookingInfo.user_booking_key.name}
            </p>
            <p>
              <strong>酒店名稱:</strong> {bookingInfo.hotel_booking_key.name}
            </p>
            <p>
              <strong>開始時間:</strong>{" "}
              {new Date(bookingInfo.start_time).toLocaleString()}
            </p>
            <p>
              <strong>結束時間:</strong>{" "}
              {new Date(bookingInfo.end_time).toLocaleString()}
            </p>
            <p>
              <strong>總時間:</strong> {bookingInfo.total_hours}小時
            </p>
            <p>
              <strong>最後金額:</strong> {bookingInfo.total_price}元
            </p>
            <p>
              <strong>預訂人電郵:</strong> {bookingInfo.booking_email}
            </p>
            <p>
              <strong>預訂人電話:</strong> {bookingInfo.booking_phone}
            </p>
            <p>
              <strong>備註:</strong> {bookingInfo.remarks}
            </p>
          </div>

          <PayPalScriptProvider options={options}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: bookingInfo.total_price.toString(),
                      },
                    },
                  ],
                });
              }}
              onApprove={async function (data, actions) {
                if (actions.order) {
                  await actions.order.capture();
                  Swal.fire({
                    title: "付款成功！",
                    text: "謝謝使用本平台預訂🤗",
                    timer: 2000,
                  });
                }
                return Promise.resolve();
              }}
            />
          </PayPalScriptProvider>
        </div>
      ) : (
        <p>No bookings available</p>
      )}
    </div>
  );
}
