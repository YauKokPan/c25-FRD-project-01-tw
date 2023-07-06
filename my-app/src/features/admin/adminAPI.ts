export const createHotel = async (hotelData: FormData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_SERVER}/hotel/create`,
      {
        method: "POST",
        body: hotelData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create hotel: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create hotel:", error);
    throw error;
  }
};
