import { useQuery } from "@tanstack/react-query";
import { API_ORIGIN, fetchJson, get } from "../../api";

export interface GalleryKey {
  hotel_img: string | undefined;
  hotel_name: string | undefined;
}

export interface Hotel {
  gallery_key: GalleryKey[];
  id: number;
  name: string;
  address: string;
  district: string;
  phone: string;
  description: string;
  profile_pic: string;
  user_id: number;
  google_map_address: string;
  total_rooms: number;
  hourly_rate: number;
  is_deleted: boolean;
  totalRating: number;
  occupancyRates: number;
  averageRatingArray: [{ rating: number }];
}

export interface CreateHotel {
  name: string;
  address: string;
  district: string;
  phone: string;
  description: string;
  profile_pic: string;
  google_map_address: string;
  total_rooms: number;
  hourly_rate: number;
}

export async function getHotelData() {
  const data = await fetchJson<Hotel[]>("/hotel/allHotels", {}, true);
  return data;
}

export function UseHotelInfo() {
  const { data } = useQuery<Hotel[], Error>({
    queryKey: ["hotelInfo"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/hotel/allHotels`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error fetching hotel data");
        }

        const result = await res.json();
        return result || [];
      } catch (error) {
        return [];
      }
    },
  });

  return data || [];
}

export function useHotelDetail(id: number) {
  return useQuery<Hotel, Error>({
    queryKey: ["hotelInfo", "hotel:" + id],
    queryFn: async () => {
      let hotels = (await get("/hotel/allHotels")) as Hotel[];
      let hotel = hotels.find((hotel) => hotel.id === id);
      if (!hotel) throw new Error("Hotel not found");
      return hotel;
    },
  });
}

export async function softDeleteHotel(id: number, is_deleted: boolean) {
  const res = await fetch(`${API_ORIGIN}/hotel/softDelete/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_deleted,
    }),
  });

  if (res.ok) {
    // If the status is 200 OK, return a default value (e.g., undefined or null)
    return null;
  } else {
    // Handle errors as needed, for example, by throwing an error or returning a default error object
    throw new Error(`Failed to soft delete hotel with id ${id}`);
  }
}

export async function editHotelAPI(
  id: number,
  name: string,
  address: string,
  phone: string
) {
  const res = await fetch(`${API_ORIGIN}/hotel/editHotel/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      address,
      phone,
    }),
  });

  if (res.ok) {
    // If the status is 200 OK, return a default value (e.g., undefined or null)
    return null;
  } else {
    // Handle errors as needed, for example, by throwing an error or returning a default error object
    throw new Error(`Failed to soft delete hotel with id ${id}`);
  }
}
