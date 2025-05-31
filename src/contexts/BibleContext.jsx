import { createContext, useContext, useState, useEffect } from "react";
import { getBibleVerses, addBibleVerse, editBibleVerse, deleteBibleVerse } from "../api/bible/bibleApi";

export const BibleVerseContext = createContext();

export function BibleVerseProvider({ children }) {
  const [verses, setVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVerses = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getBibleVerses();
      setVerses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addVerse = async (note) => {
    const newVerse = await addBibleVerse(note);
    setVerses(prev => [newVerse, ...prev]);
  };

  const updateVerse = async (id, note) => {
    const updated = await editBibleVerse(id, note);
    setVerses(prev => prev.map(v => v.id === id ? updated : v));
  };

  const removeVerse = async (id) => {
    await deleteBibleVerse(id);
    setVerses(prev => prev.filter(v => v.id !== id));
  };

  useEffect(() => {
    fetchVerses();
  }, []);

  return (
    <BibleVerseContext.Provider value={{
      verses, isLoading, error, fetchVerses,
      addVerse, updateVerse, removeVerse
    }}>
      {children}
    </BibleVerseContext.Provider>
  );
}

export function useBibleVerses() {
  return useContext(BibleVerseContext);
}