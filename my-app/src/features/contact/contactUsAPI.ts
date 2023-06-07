export async function contactUsAPI(
  contact_name: string,
  contact_email: string,
  contact_phone: string,
  contact_message: string
) {
  const res = await fetch(`${process.env.REACT_APP_API_SERVER}/contactUs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact_name,
      contact_email,
      contact_phone,
      contact_message,
    }),
  });
  return res;
}
