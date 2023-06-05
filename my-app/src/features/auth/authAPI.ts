export async function localLogin(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const result = await res.json();
  if (res.status === 200) {
    localStorage.setItem("token", result.access_token);
    return true;
  } else {
    return false;
  }
}
