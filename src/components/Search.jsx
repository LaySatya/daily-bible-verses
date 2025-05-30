import React from 'react';

export default function Search() {
  return (
    // The input container now uses focus-within for border styling
    // Added w-full for full width, and mx-auto for horizontal centering if its parent allows
    <label className="input bg-slate-600 text-white flex items-center gap-2 w-full
                      focus-within:outline-none focus-within:ring-1 focus-within:ring-teal-200 focus-within:border-transparent rounded-md">
      <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        required
        placeholder="Search bible verses"
        className="grow bg-transparent outline-none border-none placeholder-slate-400" // grow to fill available space, remove default outline
      />
    </label>
  );
}