export async function bookingsAPI(
  user_id: number,
  hotel_id: number,
  start_time: Date | null,
  end_time: Date | null,
  total_hours: number,
  total_price: number,
  booking_email: string,
  booking_phone: string,
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
      remarks,
    }),
  });
  return res;
}

export async function fetchAllBookingData() {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/bookings/`, {
    method: "GET",
  });
  return res;
}

export async function fetchUserData(userID: number) {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/bookings/${userID}`,
    {
      method: "GET",
    }
  );
  return res;
}

export async function findLatestBooking() {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/bookings/latest`,
    {
      method: "GET",
    }
  );
  return res;
}

// not configure yet for controller and service
export async function fetchHotelData(hotel_id: number): Promise<any> {
  const res = await fetch(
    `${process.env.REACT_APP_API_SERVER}/hotels/${hotel_id}`,
    {
      method: "GET",
    }
  );
  return res;
}

// not configure yet for controller and service
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
