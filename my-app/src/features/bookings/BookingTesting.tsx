import * as React from "react";
import {
  Calendar,
  CalendarChangeEvent,
} from "@progress/kendo-react-dateinputs";
import { useEffect, useState } from "react";
import { Hotel } from "../hotel/hotelAPI";

interface TimeButtonProps {
  time: string;
  clicked: boolean;
  onClick: () => void;
}

const TimeButton: React.FC<TimeButtonProps> = ({ time, clicked, onClick }) => (
  <button
    key={time}
    className={`k-button k-mb-4 ${
      clicked ? "k-button-solid k-button-solid-primary" : ""
    }`}
    style={{ width: "6rem", height: "3rem", fontSize: "0.8rem" }}
    onClick={onClick}
  >
    {time}
  </button>
);

const BookingSlot: React.FC<{ hotel: Hotel }> = (props) => {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
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
    { slot: "00:00 - 08:00", clicked: false, full: true },
  ]);

  function renderSelectedTime() {
    const slots = timeslots.filter((slot) => slot.clicked);
    if (slots.length === 0) return;
    if (slots.length === 1) return slots[0].slot;
    if (slots.length === 2)
      return (
        slots[0].slot.split(" ")[0] + " - " + slots[1].slot.split(" ").pop()
      );
    return "?";
  }

  const hotel = props.hotel;

  const onDateChange = (e: CalendarChangeEvent) => {
    setBookingDate(e.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };

  const currentDateTime = new Date();

  const handleTimeClick = (index: number) => {
    const newTimeslots = [...timeslots];
    for (let i = 0; i < newTimeslots.length; i++) {
      newTimeslots[i].clicked = false;
    }
    let self = newTimeslots[index];
    self.clicked = true;
    let other;
    newTimeslots[index].clicked = true;
    if (!newTimeslots[index].full) {
      if (index === timeslots.length - 1) {
        other = newTimeslots[index - 1];
      } else {
        other = newTimeslots[index + 1];
      }
    }
    if (!self.full && other && !other.full) {
      other.clicked = true;
    }
    setTimeslots(newTimeslots);
  };

  return (
    <div className="k-my-8">
      <div className="k-mb-4 k-font-weight-bold">預約酒店為：{hotel?.name}</div>

      <div className="k-flex k-display-flex k-mb-4">
        <Calendar
          value={bookingDate}
          onChange={onDateChange}
          min={currentDateTime}
        />
        <div className="k-ml-4 k-display-flex k-flex-col">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridGap: "1rem",
            }}
          >
            {timeslots.map((time, index) => (
              <TimeButton
                key={time.slot}
                time={time.slot}
                clicked={time.clicked}
                onClick={() => handleTimeClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div>Selected Date: {bookingDate?.toDateString()}</div>
      <div>Selected Timeslot: {renderSelectedTime()}</div>

      <pre hidden>
        <code>{JSON.stringify({ bookingDate, timeslots }, null, 2)}</code>
      </pre>

      <div className="">共需費用為: {} 元</div>
      <div>
        Email* : <input type="email" />
      </div>
      <div>
        WhatsApp聯絡電話* : <input type="text" />
      </div>
      <div>
        備註 : <input type="text" />
      </div>
      <button onClick={handleSubmit}>預約 及 付款</button>
    </div>
  );
};

export default BookingSlot;
