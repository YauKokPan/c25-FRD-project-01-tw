import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  isAuth: boolean;
  username: string;
}

const initialState: IAuthState = {
  isAuth: localStorage.getItem("token") !== null,
  username: localStorage.getItem("username") || "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuth = true;
      state.username = action.payload;
      localStorage.setItem("username", action.payload);
    },
    logout: (state) => {
      state.isAuth = false;
      state.username = "";
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("id");
      localStorage.removeItem("is_admin");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
