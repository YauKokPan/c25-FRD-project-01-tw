export let API_ORIGIN = process.env.REACT_APP_API_SERVER;

if (!API_ORIGIN) {
  if (window.location.origin === "http://localhost:3000") {
    API_ORIGIN = "http://localhost:8070";
  }
}

export async function get(url: string) {
  try {
    let res = await fetch(API_ORIGIN + url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    let json = await res.json();
    return json;
  } catch (error) {
    return { error: String(error) };
  }
}
