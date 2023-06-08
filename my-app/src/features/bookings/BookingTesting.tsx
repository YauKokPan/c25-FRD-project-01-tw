import * as React from "react";
import {
  Calendar,
  CalendarChangeEvent,
} from "@progress/kendo-react-dateinputs";
import { useEffect, useRef, useState } from "react";
import { Hotel } from "../hotel/hotelAPI";

const times = [
  "00:00 - 02:00",
  "02:00 - 04:00",
  "04:00 - 06:00",
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
  "20:00 - 22:00",
  "22:00 - 00:00",
];

const getRandomNumInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

const pickSlotTimes = (times: string[]): string[] => {
  const timesToPick = getRandomNumInRange(0, times.length);

  if (timesToPick === times.length - 1) {
    return times;
  }

  let timesPicked: string[] = [];

  while (timesToPick !== timesPicked.length - 1) {
    const index = getRandomNumInRange(0, times.length);
    const selectedTime = times[index];
    if (timesPicked.includes(selectedTime)) continue;
    timesPicked.push(selectedTime);
  }

  return timesPicked.sort();
};

interface TimeButtonProps {
  time: string;
  onClick: (time: string) => void;
}

const TimeButton: React.FC<TimeButtonProps> = ({ time, onClick }) => (
  <button key={time} className="k-button k-mb-4" onClick={() => onClick(time)}>
    {time}
  </button>
);

const BookingSlot: React.FC<{ hotel: Hotel }> = (props) => {
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingTimes, setBookingTimes] = useState<string[]>([]);
  const timeSlotCacheRef = useRef<Map<string, string[]>>(new Map());

  const hotel = props.hotel;
  useEffect(() => {
    if (!bookingDate) return;

    let newBookingTimes = timeSlotCacheRef.current.get(
      bookingDate.toDateString()
    );

    if (!newBookingTimes) {
      newBookingTimes = pickSlotTimes(times);
      timeSlotCacheRef.current.set(bookingDate.toDateString(), newBookingTimes);
    }

    setBookingTimes(newBookingTimes);
  }, [bookingDate]);

  const onDateChange = (e: CalendarChangeEvent) => {
    setSelectedTimeSlot(null);
    setBookingDate(e.value);
  };

  return (
    <div className="k-my-8">
      <div className="k-mb-4 k-font-weight-bold">預約酒店為：{hotel?.name}</div>

      <div className="k-flex k-display-flex k-mb-4">
        <Calendar value={bookingDate} onChange={onDateChange} />
        <div className="k-ml-4 k-display-flex k-flex-col">
          {bookingTimes.map((time) => (
            <TimeButton key={time} time={time} onClick={setSelectedTimeSlot} />
          ))}
        </div>
      </div>

      {bookingDate && selectedTimeSlot ? (
        <div>
          Selected slot: {bookingDate.toDateString()} at {selectedTimeSlot}
        </div>
      ) : null}
    </div>
  );
};

export default BookingSlot;
