const API_URL = "https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/books";
const API_KEY = "6240194b815c6cc745103921354bf9fa"; // Replace with your actual API key

export async function fetchBibleBooks() {
  const response = await fetch(API_URL, {
    headers: {
      "api-key": API_KEY,
      "accept": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  const data = await response.json();
  // data.data is an array of books
  return data.data.map(book => ({
    value: book.id,
    label: book.name
  }));
}
// }const API_KEY = "6240194b815c6cc745103921354bf9fa"; // Use your actual API key
export async function fetchBibleChapters(bibleBookID) {
  const url = `https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/books/${bibleBookID}/chapters`;
  const response = await fetch(url, {
    headers: {
      "api-key": API_KEY,
      "accept": "application/json"
    }
  });
  if (!response.ok) throw new Error("Failed to fetch chapters");
  const data = await response.json();
  // data.data is an array of chapters
  return data.data.map(chapter => ({
    value: chapter.id,
    label: chapter.number || chapter.id
  }));
};
export async function fetchBibleVerses(bibleBookID, chapterID) {
  const API_KEY = "6240194b815c6cc745103921354bf9fa";
  const BIBLE_ID = "06125adad2d5898a-01";
  const url = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${chapterID}/verses`;
  const response = await fetch(url, {
    headers: {
      "api-key": API_KEY,
      "accept": "application/json"
    }
  });
  if (!response.ok) throw new Error("Failed to fetch verses");
  const data = await response.json();
  // data.data is an array of verses
  return data.data.map(verse => ({
    value: verse.id,
    label: verse.reference || verse.id
  }));
}