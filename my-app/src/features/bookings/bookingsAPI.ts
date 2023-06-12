export async function bookingsAPI(
  user_id: number,
  hotel_id: number,
  start_time: Date,
  end_time: Date,
  total_hours: number,
  total_price: number,
  booking_phone: string,
  booking_email: string,
  is_shown_up: boolean
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      hotel_id,
      start_time,
      end_time,
      total_hours,
      total_price,
      booking_phone,
      booking_email,
      is_shown_up,
    }),
  });
  return res;
}
