import React from "react";

export default function VerseSelect({ value = [], onChange, options = [], loading }) {
  const handleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    // Only allow sequential selection
    if (selected.length > 1) {
      // Extract verse numbers
      const numbers = selected.map(id => parseInt(id.split('.').pop(), 10)).sort((a, b) => a - b);
      // Check if all are sequential
      const isSequential = numbers.every((num, idx, arr) => idx === 0 || num === arr[idx - 1] + 1);
      if (!isSequential) return; // Ignore non-sequential selection
    }
    onChange(selected);
  };

  return (
    <label className="select select-bordered bg-slate-600 text-white w-full rounded-lg
                      focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-transparent">
      <span className="label-text text-slate-400 mb-1 w-16 block">Verse(s)</span>
      <select
        multiple
        className="bg-transparent outline-none border-none text-white w-full"
        value={value}
        onChange={handleChange}
        disabled={loading || !options.length}
        size={Math.min(8, options.length || 1)}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}