import React, { useState, useEffect, FormEvent } from "react";
import { getUser, updateUser, User } from "./userAPI";
import { getUserId } from "../auth/authAPI";

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Number(getUserId());
      const fetchedUser = await getUser(userId);
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (user) {
      const updated = await updateUser(user);
      if (updated) {
        alert("User updated successfully");
      } else {
        alert("User not updated");
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Info</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
