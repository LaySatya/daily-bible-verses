import { API_BASE_URL } from "../config";

export async function getBibleVerses() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await fetch(`${API_BASE_URL}/verse-notes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw data; // throw the whole error object
    }
    return data.data;
  } else {
    // Not JSON, probably HTML error page
    const text = await response.text();
    throw new Error("Server error: " + text.slice(0, 100));
  }
}