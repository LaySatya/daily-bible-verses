import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

// Helper to display verse numbers as a range or comma-separated
function displayVerseRange(verse) {
  if (!verse) return "";
  const numbers = verse.split(',').map(v => parseInt(v.trim(), 10)).sort((a, b) => a - b);
  if (numbers.length === 1) return `${numbers[0]}`;
  const isSequential = numbers.every((num, idx, arr) => idx === 0 || num === arr[idx - 1] + 1);
  if (isSequential) return `${numbers[0]}-${numbers[numbers.length - 1]}`;
  return numbers.join(",");
}

// Helper to split and highlight verse numbers in the verse text
function renderVerseText(verse, verse_text) {
  if (!verse || !verse_text) return null;
  // Split verse numbers and texts
  const numbers = verse.split(',').map(v => parseInt(v.trim(), 10));
  // If only one verse, just return
  if (numbers.length === 1) {
    return (
      <div>
        <span className="text-teal-400 font-bold mr-1">{numbers[0]}</span>
        {verse_text}
      </div>
    );
  }
  // Try to split the verse_text into parts for each verse number at the start of a line
  // This works if verse_text is like "1 In the beginning... 2 And the earth... 3 And God said..."
  // It will split before each number followed by a space
  const parts = verse_text.split(/ (?=\d+\s)/g);
  return (
    <div>
      {parts.map((part, idx) => {
        // Extract the number at the start
        const match = part.match(/^(\d+)\s?(.*)/);
        if (match) {
          return (
            <div key={idx}>
              <span className="text-teal-400 font-bold mr-1">{match[1]}</span>
              {match[2]}
            </div>
          );
        }
        // fallback
        return <div key={idx}>{part}</div>;
      })}
    </div>
  );
}

export default function NoteCard({
  id, book, chapter, verse, verse_text, note, tags, created_at,
  onEdit, onDelete, onView
}) {
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-slate-700 z-40 rounded-lg shadow-md p-6 border border-slate-600 hover:shadow-lg transition duration-200 ease-in-out flex flex-col h-full relative">
      <div className="absolute top-4 right-4 z-10">
        <div className="dropdown dropdown-left dropdown-center">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle m-1.5 text-white hover:bg-slate-600">
            <BsThreeDotsVertical className="text-lg " />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content dropdown-top bg-slate-600 rounded-box z-[1] mt-1 w-32 p-2 shadow"
          >
            <li>
              <button className="hover:bg-slate-600 text-slate-200 w-full text-left" onClick={() => onView && onView(id)}><FaEye/> View</button>
            </li>
            <li>
              <button className="hover:bg-slate-600 text-slate-200 w-full text-left" onClick={() => onEdit && onEdit(id)}><FaEdit/> Edit</button>
            </li>
            <li>
              <button className="hover:bg-red-700 text-red-100 hover:text-white w-full text-left" onClick={() => onDelete && onDelete(id)}><FaTrash/>Delete</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pr-8">
        <h3 className="text-xl font-semibold text-teal-300">
          {book} {chapter}:{displayVerseRange(verse)}
        </h3>
      </div>

      <div
        className="text-slate-300 italic mb-3 text-base leading-relaxed max-h-32 overflow-auto pr-2"
        style={{ wordBreak: "break-word" }}
        title={verse_text}
      >
        {renderVerseText(verse, verse_text)}
      </div>

      <div className="flex-1 mb-auto">
        <p className="text-slate-200 text-lg leading-relaxed">
          {note}
        </p>
      </div>

      {tags && (
        <div className="mt-auto pt-4 border-t border-slate-600">
          {typeof tags === "string"
            ? tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-slate-600 text-slate-300 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                >
                  #{tag.trim()}
                </span>
              ))
            : tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-slate-600 text-slate-300 text-xs px-3 py-1 rounded-full mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
        </div>
      )}
      <div className="text-xs text-slate-400 mt-2">{formattedDate}</div>
    </div>
  );
}