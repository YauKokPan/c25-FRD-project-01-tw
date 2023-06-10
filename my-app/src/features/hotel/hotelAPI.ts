import { useQuery } from "@tanstack/react-query";
import { get } from "../../api";

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
  room_number: number;
  hourly_rate: number;
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
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log("API response:", res);

        if (!res.ok) {
          throw new Error("Error fetching hotel data");
        }

        const result = await res.json();
        // console.log("Parsed JSON:", result);

        return result || [];
      } catch (error) {
        // console.error("Error fetching hotel data:", error);
        return [];
      }
    },
  });

  return data || [];

  // if (isLoading || isFetching || error || !data) {
  //   return [];
  // }
  // console.log("Data:", data);`
  // return data;
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
