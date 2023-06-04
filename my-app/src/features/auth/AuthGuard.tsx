// import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hook";
// import React from "react";

export function AuthGuard() {
  return useAppSelector((state) => state.auth.isAuth);
}

// export function AuthGuard() {
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuth);

//   if (isAuthenticated) {
//     return <Outlet />;
//   } else {
//     return <Navigate to="/login" replace />;
//   }
// }
