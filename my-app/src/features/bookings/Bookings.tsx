import * as React from "react";
import "./Bookings.css";
import {
  Calendar,
  CalendarChangeEvent,
} from "@progress/kendo-react-dateinputs";
import { useState } from "react";
import { Hotel } from "../hotel/hotelAPI";
import { useEffect } from "react";

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
    { slot: "00:00 - 01:00", clicked: false },
    { slot: "01:00 - 02:00", clicked: false },
    { slot: "03:00 - 04:00", clicked: false },
    { slot: "05:00 - 06:00", clicked: false },
    { slot: "06:00 - 07:00", clicked: false },
    // { slot: "00:00 - 07:00", clicked: false, full: true, count: 7 },
  ]);

  function renderSelectedTime() {
    const slots = timeslots.filter((slot) => slot.clicked);
    if (slots.length === 0) return;
    if (slots.length === 1) return slots[0].slot;

    return slots.map((slot) => slot.slot).join(" , ");
    // slots[0].slot.split(" ")[0] + " - " + slots[1].slot.split(" ").pop()

    // return "?";
  }

  const hotel = props.hotel;

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
      return count + (slot ? 7 : 1);
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (bookingDate === null) {
      alert("請先選擇預約日期");
      return;
    }

    if (startTime === null || endTime === null) {
      alert("請先選擇預約時間");
      return;
    }
  };

  useEffect(() => {
    console.log("Start time:", startTime);
    console.log("End time:", endTime);
  }, [startTime, endTime]);

  return (
    <div className="k-my-8">
      <div className="k-mb-4 k-font-weight-bold">預約酒店為：{hotel?.name}</div>

      <div className="k-mb-4 k-font-weight-bold">
        <div className="calendar-container">請選擇預約日期：</div>
        <Calendar
          value={bookingDate}
          onChange={onDateChange}
          className="k-mb-4"
          min={currentDateTime}
        />
      </div>
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
      <button className="reset-btn" onClick={handleResetClick}>
        重置預約時間
      </button>

      <div>Selected Date: {bookingDate?.toDateString()}</div>
      <div>Selected Timeslot: {renderSelectedTime()}</div>
      <div>預約總時數為: {clickedCount} 小時</div>

      {/* <pre hidden>
        <code>{JSON.stringify({ bookingDate, timeslots }, null, 2)}</code>
      </pre> */}

      <div className="">酒店一小時的價錢為：{hotel.hourly_rate} 元</div>
      <div className="">共需費用為: {totalPrice} 元</div>
      <form>
        <div>
          Email* : <input type="email" placeholder="請輸入電郵" required />
        </div>
        <div>
          WhatsApp聯絡電話* :{" "}
          <input
            type="tel"
            pattern="[0-9]{8}"
            required
            className="form-control"
            placeholder="請輸入電話號碼"
          />
        </div>
        <div>
          備註 : <input type="text" />
        </div>
        <button onClick={handleSubmit}>預約 及 付款</button>
      </form>
    </div>
  );
};

export default BookingSlot;
