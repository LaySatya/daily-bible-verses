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
    const data = await response.json();
    if (!response.ok) {
      throw data; // throw the whole error object
    }
    return data.data;
}

export async function addBibleVerse(note) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/verse-notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data.data;
}

export async function editBibleVerse(id, note) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/verse-notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data.data;
}

export async function deleteBibleVerse(id) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/verse-notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw data;
  }
  return true;
}