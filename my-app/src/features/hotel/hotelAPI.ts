import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ORIGIN, get } from "../../api";

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
  is_favorite: boolean;
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

async function createHotel(hotelData: CreateHotel) {
  const total_rooms = Number(hotelData.total_rooms);
  const hourly_rate = Number(hotelData.hourly_rate);
  const response = await fetch(
    `${process.env.REACT_APP_API_SERVER}/hotel/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...hotelData,
        total_rooms,
        hourly_rate,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Error creating hotel:",
      response.status,
      response.statusText
    );
    throw new Error("Error creating hotel");
  }

  return response.json();
}

// Custom hook to use the createHotel function with useMutation
export function useCreateHotel() {
  return useMutation(createHotel);
}

export const fetchUserFavorites = async (userID: number) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER}/favorite/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      try {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || "Failed to fetch user favorites";
        console.error(`Error ${response.status}: ${errorMessage}`);
        throw new Error(errorMessage);
      } catch (e) {
        console.error(
          `Error ${response.status}: Failed to fetch user favorites`
        );
        throw new Error("Failed to fetch user favorites");
      }
    }

    const favorites = await response.json();

    const favoriteHotels = favorites.map(
      (favorite: { hotel: any }) => favorite.hotel
    );

    return favoriteHotels;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw new Error("Failed to fetch user favorites");
  }
};

export const addToFavorites = async (
  hotelID: number,
  isFavorite: boolean,
  userId: number
) => {
  try {
    const response = await fetch(`${API_ORIGIN}/favorite/${hotelID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        is_favorite: isFavorite,
        user_id: userId,
      }),
    });

    return response.json();
  } catch (error) {
    console.error("Error updating user favorite:", error);
  }
};

export const removeFromFavorites = async (hotelID: number, userID: number) => {
  try {
    const response = await fetch(
      `${API_ORIGIN}/favorite/${userID}/${hotelID}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove hotel from favorites");
    }

    return true;
  } catch (error) {
    console.error("Error removing hotel from favorites:", error);
    throw new Error("Failed to remove hotel from favorites");
  }
};
