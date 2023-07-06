export let API_ORIGIN = process.env.REACT_APP_API_SERVER;

if (!API_ORIGIN) {
  if (window.location.origin === "http://localhost:3000") {
    API_ORIGIN = "http://localhost:8070";
  }
}

class APIException extends Error {
  constructor(public httpStatus: number, message?: string) {
    super(message ?? "error message");
  }
}

export async function fetchJson<T = unknown>(
  url: string,
  init?: RequestInit | undefined,
  requiredAuth = false
) {
  const myInit = init ?? {};
  if (requiredAuth) {
    myInit.headers = myInit.headers ?? {};
    myInit.headers = {
      ...myInit.headers,
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  }
  const resp = await fetch(API_ORIGIN + url, myInit);
  const json = await resp.json();
  if (resp.status < 200 || resp.status >= 300) {
    throw new APIException(resp.status, json.message);
  }
  return json as T;
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
