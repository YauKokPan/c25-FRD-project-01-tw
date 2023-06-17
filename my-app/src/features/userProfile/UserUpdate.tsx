import React, { useState, useEffect, FormEvent } from "react";
import { getUser, updateUser, User } from "./userAPI";
import { getUserId } from "../auth/authAPI";
import "./UserUpdate.css";

interface UserUpdateProps {
  onEditComplete: () => void;
}

export default function UserUpdate({ onEditComplete }: UserUpdateProps) {
  const [user, setUser] = useState<User | null>(null);

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
      const userId = Number(getUserId());
      const updated = await updateUser(userId, user);
      if (updated) {
        alert("User updated successfully");
        onEditComplete();
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
    <div className="userUpdate-container">
      <form className="userUpdate-form" onSubmit={handleSubmit}>
        <div className="userUpdate-label">
          Name :
          <span className="userUpdate-span">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
            />
          </span>
        </div>
        <div className="userUpdate-label">
          Email :
          <span className="userUpdate-span">
            {" "}
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </span>
        </div>
        <div className="userUpdate-label">
          Phone :
          <span className="userUpdate-span">
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
            />
          </span>
        </div>
        <button className="userUpdate-btn" type="submit">
          確認
        </button>
      </form>
    </div>
  );
}
