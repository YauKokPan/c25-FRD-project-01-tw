export async function localLogin(
  id: number,
  name: string,
  email: string,
  password: string,
  is_admin: boolean
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      name,
      email,
      password,
      is_admin,
    }),
  });

  const result = await res.json();
  if (res.status === 200) {
    localStorage.setItem("id", result.id);
    localStorage.setItem("token", result.access_token);
    localStorage.setItem("name", result.name);
    localStorage.setItem("email", result.email);
    localStorage.setItem("is_admin", result.is_admin);

    return true;
  } else {
    return false;
  }
}

export function getUserName() {
  return localStorage.getItem("name");
}

export function getUserId(): string {
  return String(localStorage.getItem("id"));
}

export function getIsAdmin(): boolean {
  const isAdmin = localStorage.getItem("is_admin");
  return isAdmin === "true";
}
