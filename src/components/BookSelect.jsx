import React, { useEffect, useState } from 'react';
import { fetchBibleBooks } from '../api/bible/bookApi';

export default function BookSelect({ value, onChange, label }) {
  const [options, setOptions] = useState([
    { value: "", label: "All" }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBibleBooks()
      .then(books => setOptions([{ value: "", label: "All" }, ...books]))
      .catch(() => setOptions([{ value: "", label: "All" }]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <label className="select select-bordered bg-slate-600 text-white w-full rounded-lg
                      focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-transparent">
      <span className="label-text text-slate-400 mb-1 w-16 block">{label || "Book"}</span>
      <select
        className="bg-transparent outline-none border-none text-white w-full"
        value={value}
        onChange={onChange}
        disabled={loading}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}