import React from "react";

export default function ChapterSelect({ value, onChange, options, loading }) {
  return (
    <label className="select select-bordered bg-slate-600 text-white w-full rounded-lg
                      focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-300 focus-within:border-transparent">
      <span className="label-text text-slate-400 mb-1 w-16 block">Chapter</span>
      <select
        className="bg-transparent outline-none border-none text-white w-full"
        value={value}
        onChange={onChange}
        disabled={loading || !options.length}
      >
        <option value="">Select chapter</option>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}