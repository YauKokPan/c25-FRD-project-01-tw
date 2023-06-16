import * as React from "react";
import "./Bookings.css";
import {
  Calendar,
  CalendarChangeEvent,
} from "@progress/kendo-react-dateinputs";
import { useState } from "react";
import { Hotel } from "../hotel/hotelAPI";
import { getUserId } from "../auth/authAPI";
import { bookingsAPI, findLatestBooking } from "./bookingsAPI";
import { useNavigate } from "react-router-dom";
// import CheckOutPage from "../payment/CheckOutPage";
import emailjs from "@emailjs/browser";
import { UserData } from "./BookingResult";

interface TimeButtonProps {
  time: string;
  clicked: boolean;
  onClick: () => void;
  index: number;
}

const TimeButton: React.FC<TimeButtonProps> = ({ time, clicked, onClick }) => (
  <button
    key={time}
    className={`k-button k-mb-4 ${
      clicked ? "k-button-solid k-button-solid-primary" : ""
    }`}
    style={{
      width: "6rem",
      height: "3rem",
      fontSize: "0.8rem",
      marginRight: "0.5rem",
    }}
    onClick={onClick}
  >
    {time}
  </button>
);

const BookingSlot: React.FC<{ hotel: Hotel }> = (props) => {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [booking_email, setBookingEmail] = useState("");
  const [booking_phone, setBookingPhone] = useState("");
  const [remarks, setRemarks] = useState("");
  const [is_shown_up, setIsShownUp] = useState<boolean>(false);

  const [timeslots, setTimeslots] = useState([
    { slot: "07:00 - 08:00", clicked: false },
    { slot: "08:00 - 09:00", clicked: false },
    { slot: "09:00 - 10:00", clicked: false },
    { slot: "10:00 - 11:00", clicked: false },
    { slot: "11:00 - 12:00", clicked: false },
    { slot: "12:00 - 13:00", clicked: false },
    { slot: "13:00 - 14:00", clicked: false },
    { slot: "14:00 - 15:00", clicked: false },
    { slot: "15:00 - 16:00", clicked: false },
    { slot: "16:00 - 17:00", clicked: false },
    { slot: "17:00 - 18:00", clicked: false },
    { slot: "18:00 - 19:00", clicked: false },
    { slot: "19:00 - 20:00", clicked: false },
    { slot: "20:00 - 21:00", clicked: false },
    { slot: "21:00 - 22:00", clicked: false },
    { slot: "22:00 - 23:00", clicked: false },
    { slot: "23:00 - 00:00", clicked: false },
    // { slot: "00:00 - 01:00", clicked: false },
    // { slot: "01:00 - 02:00", clicked: false },
    // { slot: "03:00 - 04:00", clicked: false },
    // { slot: "05:00 - 06:00", clicked: false },
    // { slot: "06:00 - 07:00", clicked: false },
    { slot: "00:00 - 07:00", clicked: false, full: true, count: 7 },
  ]);

  const hotel = props.hotel;
  const userID = Number(getUserId());
  const navigate = useNavigate();

  function renderSelectedTime() {
    const slots = timeslots.filter((slot) => slot.clicked);
    if (slots.length === 0) return;
    if (slots.length === 1) return slots[0].slot;

    return slots.map((slot) => slot.slot).join(" , ");
    // slots[0].slot.split(" ")[0] + " - " + slots[1].slot.split(" ").pop()

    // return "?";
  }

  const handleBookingPhoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBookingPhone(event.target.value);
  };

  const handleBookingEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBookingEmail(event.target.value);
  };

  const handleRemarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemarks(event.target.value);
  };

  const onDateChange = (e: CalendarChangeEvent) => {
    setBookingDate(e.value);
  };

  const currentDateTime = new Date();

  const handleTimeClick = (index: number) => {
    const newTimeslots = [...timeslots];
    const clickedSlot = newTimeslots[index];
    clickedSlot.clicked = !clickedSlot.clicked;
    const selectedSlots = newTimeslots.filter((slot) => slot.clicked);

    if (selectedSlots.length > 0 && bookingDate !== null) {
      const startSlot = selectedSlots[0];
      const endSlot = selectedSlots[selectedSlots.length - 1];
      const startHour = Number(startSlot.slot.split(":")[0]);
      const endHour = Number(endSlot.slot.split(":")[0]) + 1;
      const startMinute = 0;
      const endMinute = 0;
      const startDate = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        startHour,
        startMinute,
        0
      );
      const endDate = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        endHour,
        endMinute,
        0
      );
      setStartTime(startDate);
      setEndTime(endDate);
    } else {
      setStartTime(null);
      setEndTime(null);
    }

    setTimeslots(newTimeslots);
  };

  const clickedCount = timeslots.reduce((count, slot) => {
    if (slot.clicked) {
      return count + (slot.full ? 7 : 1);
    } else {
      return count;
    }
  }, 0);

  const hourlyRate = hotel.hourly_rate;
  const totalPrice = hourlyRate * clickedCount;

  const handleResetClick = () => {
    const newTimeslots = timeslots.map((slot) => ({ ...slot, clicked: false }));
    setTimeslots(newTimeslots);
  };

  // send emailjs
  const sendEmail = (bookingData: any) => {
    emailjs
      .send(
        "service_ltoylm6",
        "template_mc7iyif",
        {
          hotel_name: bookingData.hotelname,
          user_name: bookingData.username,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          total_price: bookingData.totalPrice,
          booking_email: bookingData.email,
        },
        "R0o3xZuCwgV901zHG"
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

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    function validateForm(): boolean {
      if (bookingDate === null) {
        alert("請先選擇預約日期");
        return false;
      }
      if (booking_email === "" || booking_phone === "") {
        alert("請填寫電子郵件和電話");
        return false;
      }
      if (startTime === null || endTime === null) {
        alert("請先選擇預約時間");
        return false;
      }
      return true;
    }

    const isValid = validateForm();

    if (!isValid) return;

    try {
      const response = await bookingsAPI(
        userID,
        hotel.id,
        startTime,
        endTime,
        clickedCount,
        totalPrice,
        booking_email,
        booking_phone,
        is_shown_up,
        remarks
      );

      const latestBookings = await findLatestBooking();

      const latestBookingsData: UserData = await latestBookings.json();

      if (response.ok && isValid) {
        const bookingData = {
          hotelname: latestBookingsData.hotel_booking_key.name,
          username: latestBookingsData.user_booking_key.name,
          email: booking_email,
          startTime: startTime?.toLocaleString(),
          endTime: endTime?.toLocaleString(),
          totalPrice: totalPrice,
        };
        sendEmail(bookingData);
        navigate("/payment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="k-my-8">
      <div className="k-mb-4 k-font-weight-bold">預約酒店為：{hotel?.name}</div>

      <div className="k-mb-4 k-font-weight-bold">
        <div className="calendar-container">請選擇預約日期：</div>
        <Calendar
          value={bookingDate}
          onChange={onDateChange}
          className="k-mb-4 calendar-width"
          min={currentDateTime}
        />
      </div>
      {bookingDate && (
        <>
          <div className="k-mb-4 k-font-weight-bold">請選擇預約時間：</div>
          <div className="k-mb-4">
            <div className="timeslots-container">
              {timeslots.map((timeslot, index) => (
                <TimeButton
                  key={timeslot.slot}
                  time={timeslot.slot}
                  clicked={timeslot.clicked}
                  onClick={() => handleTimeClick(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </>
      )}
      <button className="reset-btn" onClick={handleResetClick}>
        重置預約時間
      </button>

      <div>可訂房間數目: {hotel.total_rooms} </div>
      <div>Selected Date: {bookingDate?.toDateString()}</div>
      <div>Selected Timeslot: {renderSelectedTime()}</div>
      <div>預約總時數為: {clickedCount} 小時</div>

      <div className="">酒店一小時的價錢為：{hotel.hourly_rate} 元</div>
      <div className="">共需費用為: {totalPrice} 元</div>
      <form>
        <div>
          Email* :{" "}
          <input
            type="email"
            placeholder="請輸入電郵"
            className="form-control"
            value={booking_email}
            onChange={handleBookingEmailChange}
            required
          />
        </div>

        <div>
          WhatsApp聯絡電話* :{" "}
          <input
            type="tel"
            pattern="[0-9]{8}"
            required
            className="form-control"
            placeholder="請輸入電話號碼"
            value={booking_phone}
            onChange={handleBookingPhoneChange}
          />
        </div>
        <div>
          備註 :{" "}
          <input
            type="text"
            className="form-control"
            placeholder="如有特別要求，請列明。"
            value={remarks}
            onChange={handleRemarksChange}
          />
        </div>
        <button onClick={handleSubmit}>預約 及 付款</button>
      </form>
    </div>
  );
};

export default BookingSlot;
