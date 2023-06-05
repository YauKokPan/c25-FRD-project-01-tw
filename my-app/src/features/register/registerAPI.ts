export async function registerAPI(
  name: string,
  email: string,
  password: string,
  phone: string
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
    }),
  });
  return res;
}
