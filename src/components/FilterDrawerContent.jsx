import React from 'react';
import BookSelect from './BookSelect';
import DateSelect from './DateSelect';
import Search from './Search';
import { FaCross } from 'react-icons/fa'; // Ensure react-icons is installed
import BibleImage from '../assets/images/bible.png'; // Adjust the path as necessary

export default function FilterDrawerContent() {
  return (
    <div className="menu z-50 bg-slate-700 text-white min-h-full w-80 p-6 shadow-lg flex flex-col overflow-hidden">
      {/* Drawer Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center">
          <FaCross className='mr-2.5 text-teal-300' style={{ textShadow: '0 0 8px rgba(0, 255, 255, 0.7)' }} /> {/* Adjusted text-shadow back for better glow */}
          Bible Note
        </h2>
      </div>

      {/* Filter Section - Scrolls if content overflows */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 -mr-2">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Search</h3> {/* Changed back to 'Search & Filter' as it's more comprehensive */}
        <Search />
        <DateSelect />
        <BookSelect />
        {/* Add a filter for Tags here if you create a component for it */}
        {/* <TagFilter /> */}
      </div>


      {/* Modern Image at the Bottom */}
      <div
        className="mt-6 h-72 bg-cover bg-no-repeat bg-center overflow-hidden rounded-lg"
      >
        <img src={BibleImage} className='-translate-1.5' alt="" />
        {/* Optional: Add a subtle overlay here if the image is too bright */}
        <div className="w-full h-full bg-gradient-to-t from-slate-700 via-transparent to-transparent opacity-80"></div>
      </div>
    </div>
  );
}