import { fetchJson } from "../../api";

export async function localLogin(
  name: string,
  email: string,
  password: string
) {
  type Response = {
    id: number;
    access_token: string;
    name: string;
    email: string;
    is_admin: boolean;
  };
  const result = await fetchJson<Response>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  try {
    // token, user
    localStorage.setItem("id", String(result.id));
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("name", result.name);
    localStorage.setItem("email", result.email);
    localStorage.setItem("is_admin", String(result.is_admin));
    return true;
  } catch (err) {
    return false;
  }
}

export function getUserName() {
  return localStorage.getItem("name");
}

export function getUserIdV2(): number {
  return +(localStorage.getItem("id") ?? "");
}

export function getUserId(): string {
  return String(localStorage.getItem("id"));
}

export function getIsAdmin(): boolean {
  const isAdmin = localStorage.getItem("is_admin");
  return isAdmin === "true";
}
