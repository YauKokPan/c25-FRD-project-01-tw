import { API_ORIGIN } from "../../api";

export async function ratingAPI(
  user_id: number,
  hotel_id: number,
  nick_name: string,
  comment_text: string,
  rating: number
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/comments/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      hotel_id,
      nick_name,
      comment_text,
      rating,
    }),
  });
  return res;
}

export async function fetchComments(hotelId: number) {
  const response = await fetch(`${API_ORIGIN}/comments/${hotelId}`);
  if (!response.ok) {
    throw new Error(`Error fetching comments: ${response.statusText}`);
  }
  return await response.json();
}
