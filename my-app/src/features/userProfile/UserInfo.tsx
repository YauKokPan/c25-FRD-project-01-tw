import React, { useState, useEffect } from "react";
import { getUser, User } from "./userAPI";
import { getUserId } from "../auth/authAPI";
import "./UserInfo.css";

interface UserInfoProps {
  onEditComplete: () => void;
}

export default function UserInfo({ onEditComplete }: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null);

  const handleEditClick = () => {
    onEditComplete();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Number(getUserId());
      const fetchedUser = await getUser(userId);
      setUser(fetchedUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>No User</div>;
  }

  return (
    <div className="userInfo-container">
      <form className="userInfo-form">
        <div className="userInfo-label">
          Name :<span className="userInfo-span">{user.name} </span>
        </div>
        <div className="userInfo-label">
          Email :<span className="userInfo-span">{user.email}</span>
        </div>
        <div className="userInfo-label">
          Phone :<span className="userInfo-span">{user.phone}</span>
        </div>
        <button
          className="userInfo-btn"
          type="button"
          onClick={handleEditClick}
        >
          更改個人資料
        </button>
      </form>
    </div>
  );
}
