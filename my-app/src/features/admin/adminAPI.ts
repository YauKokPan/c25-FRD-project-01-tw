// import { useMutation } from "@tanstack/react-query";
import { API_ORIGIN } from "../../api";

export const createHotel = async (hotelData: FormData) => {
  try {
    console.log("fetch hotelFormData", JSON.stringify(hotelData));
    const response = await fetch(`${API_ORIGIN}/hotel/create`, {
      method: "POST",
      body: hotelData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create hotel: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create hotel:", error);
    throw error;
  }
};
