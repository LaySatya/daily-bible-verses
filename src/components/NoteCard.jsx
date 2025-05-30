import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'; // Import the three-dot icon
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

export default function NoteCard({ book, chapter, verse, verse_text, note, tags, created_at }) {
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  

  return (
    <div className="bg-slate-700 z-40 rounded-lg shadow-md p-6 border border-slate-600 hover:shadow-lg transition duration-200 ease-in-out flex flex-col h-full relative"> {/* Added 'relative' */}
      {/* Dropdown in the top-right corner */}
      <div className="absolute top-4 right-4 z-10"> {/* Positioned absolutely */}
        <div className="dropdown dropdown-left dropdown-center">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle m-1.5 text-white hover:bg-slate-600">
            <BsThreeDotsVertical className="text-lg " />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content dropdown-top bg-slate-600 rounded-box z-[1] mt-1 w-32 p-2 shadow"
          >
            <li>
              <a className="hover:bg-slate-600 text-slate-200"><FaEye/> View</a>
            </li>
            <li>
              <a className="hover:bg-slate-600 text-slate-200"><FaEdit/> Edit</a>
            </li>
            <li>
              <a className="hover:bg-red-700 text-red-100 hover:text-white"><FaTrash/>Delete</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main card content, adjusted padding to avoid overlapping with dropdown */}
      <div className="flex items-center justify-between mb-4 pr-8"> {/* Added pr-8 to make space for dropdown */}
        <h3 className="text-xl font-semibold text-teal-300">
          {book} {chapter}:{verse}
        </h3>
        {/* <span className="text-sm text-slate-400">{formattedDate}</span> */}
      </div>

      <p className="text-slate-300 italic mb-3 text-base leading-relaxed">
        "{verse_text}"
      </p>

      <div className="flex-1 mb-auto">
        <p className="text-slate-200 text-lg leading-relaxed">
          {note}
        </p>
      </div>

      {tags && (
        <div className="mt-auto pt-4 border-t border-slate-600">
          {tags.split(',').map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-slate-600 text-slate-300 text-xs px-3 py-1 rounded-full mr-2 mb-2"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
      {/* Removed the old action button div */}
    </div>
  );
}