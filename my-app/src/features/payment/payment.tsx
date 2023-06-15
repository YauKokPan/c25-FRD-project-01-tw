import React, { useState, useEffect } from "react";
import { findLatestBooking } from "../bookings/bookingsAPI";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";

interface Booking {
  id: number;
  user_id: number;
  hotel_id: number;
  start_time: string;
  end_time: string;
  total_hours: number;
  total_price: number;
  booking_email: string;
  booking_phone: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  user_booking_key: {
    id: number;
    name: string;
    email: string;
    phone: string;
    is_admin: boolean;
    createdAt: string;
    updatedAt: string;
  };
  hotel_booking_key: {
    id: number;
    name: string;
    address: string;
    district: string;
    phone: string;
  };
}

export default function Payment() {
  const [bookingInfo, setBookingInfo] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await findLatestBooking();
      const latestBooking = await response.json();
      setBookingInfo(latestBooking);
    };
    fetchData();
  }, []);

  const options = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || "",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {bookingInfo ? (
        <div style={{ textAlign: "center", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-start",
            }}
          >
            <h2>請確認以下資料與付款：</h2>
            <p style={{ alignSelf: "flex-start" }}>
              預訂人姓名: {bookingInfo.user_booking_key.name}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              酒店名稱: {bookingInfo.hotel_booking_key.name}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              開始時間: {new Date(bookingInfo.start_time).toLocaleString()}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              結束時間: {new Date(bookingInfo.end_time).toLocaleString()}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              總時間: {bookingInfo.total_hours}小時
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              最後金額: {bookingInfo.total_price}元
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              預訂人電郵: {bookingInfo.booking_email}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              預訂人電話: {bookingInfo.booking_phone}
            </p>
            <p style={{ alignSelf: "flex-start" }}>
              備註: {bookingInfo.remarks}
            </p>
          </div>

          <PayPalScriptProvider options={options}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        // currency_code: "HKD",
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
