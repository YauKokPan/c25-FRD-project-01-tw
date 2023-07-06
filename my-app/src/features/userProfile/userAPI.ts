import { get } from "../../api";
import { API_ORIGIN } from "../../api";

export interface User {
  user_id: number;
  username: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export async function getUser(userId: number): Promise<User | null> {
  try {
    const response = await get(`/user/${userId}`);
    if (response.error) {
      return null;
    }
    return response;
  } catch (error) {
    return null;
  }
}

export async function updateUser(
  userId: number,
  updatedUser: User
): Promise<boolean> {
  try {
    const response = await fetch(API_ORIGIN + `/user/${userId}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedUser),
    });

    if (response.status === 200) {
      return true;
    } else {
      console.error("Error updating user:", await response.json());
      return false;
    }
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}
