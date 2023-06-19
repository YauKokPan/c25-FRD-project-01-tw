import { API_ORIGIN } from "../../api";

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
