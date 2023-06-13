export async function bookingsAPI(
  user_id: number,
  hotel_id: number,
  start_time: Date | null,
  end_time: Date | null,
  total_hours: number,
  total_price: number,
  booking_email: string,
  booking_phone: string,
  is_shown_up: boolean = true, // added optional is_shown_up parameter with default value
  remarks: string
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
      booking_email,
      booking_phone,
      is_shown_up, // added is_shown_up field to the request payload
      remarks,
    }),
  });
  return res;
}

export async function fetchAllBookingData() {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/bookings/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res;
}

export async function fetchUserData(userID: number) {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/bookings/${userID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}

export async function fetchHotelData(hotel_id: number): Promise<any> {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/hotels/${hotel_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res;
}

export async function updateBookingData(userID: number) {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/bookings/${userID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
      }),
    }
  );
  return res;
}

//may be change in future
export async function removeBookingData(userID: number) {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/bookings/${userID}`,
    {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
      }),
    }
  );
  return res;
}
