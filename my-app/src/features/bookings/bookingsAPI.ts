export async function bookingsAPI(
  name: string,
  hotel_name: string,
  start_time: Date,
  end_time: Date,
  total_hours: number,
  email: string,
  phone: number,
  total_price: number
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      hotel_name,
      start_time,
      end_time,
      total_hours,
      email,
      phone,
      total_price,
    }),
  });
  return res;
}
