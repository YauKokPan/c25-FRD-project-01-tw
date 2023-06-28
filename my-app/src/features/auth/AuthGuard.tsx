import { useAppSelector } from "../../app/hook";

export function AuthGuard() {
  return useAppSelector((state) => state.auth.isAuth);
}
