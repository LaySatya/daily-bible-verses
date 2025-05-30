import { createContext, useContext, useState, useEffect } from "react";
import { getBibleVerses } from "../api/bible/bibleApi";

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

  useEffect(() => {
    fetchVerses();
  }, []);

  return (
    <BibleVerseContext.Provider value={{ verses, isLoading, error, fetchVerses }}>
      {children}
    </BibleVerseContext.Provider>
  );
}

export function useBibleVerses() {
  return useContext(BibleVerseContext);
}