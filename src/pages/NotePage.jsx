// pages/NotePage.jsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import Navbar from "../components/Navbar";
import FilterDrawerContent from "../components/FilterDrawerContent";
import NoteCard from "../components/NoteCard";
import BookSelect from '../components/BookSelect';
import { FaPlus, FaTimes } from 'react-icons/fa';
import BgImage from '../assets/images/P23.jpg'; // Adjust the path as necessary
import { useBibleVerses, BibleVerseProvider} from '../contexts/BibleContext'; // <-- Make sure this path matches your project

export default function NotePage() {

    // const [notes, setNotes] = useState([]);
const { verses, isLoading, error, fetchVerses } = useBibleVerses();
  // States for the new note modal and form fields
  const [showModal, setShowModal] = useState(false);
  const [newNoteBook, setNewNoteBook] = useState('');
  const [newNoteChapter, setNewNoteChapter] = useState('');
  const [newNoteVerse, setNewNoteVerse] = useState('');
  const [newNoteVerseText, setNewNoteVerseText] = useState('');
  const [newNoteNote, setNewNoteNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentTagInput, setCurrentTagInput] = useState('');

  // --- Modal and Tag Management Functions ---
  const openModal = () => {
    setShowModal(true);
    // Reset form fields when opening modal
    setNewNoteBook('');
    setNewNoteChapter('');
    setNewNoteVerse('');
    setNewNoteVerseText('');
    setNewNoteNote('');
    setSelectedTags([]);
    setCurrentTagInput('');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addTag = (tagText) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
    }
    setCurrentTagInput('');
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(currentTagInput);
    }
  };

  const handleTagInputBlur = () => {
    addTag(currentTagInput);
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };


  return (
    <div className="drawer lg:drawer-open h-screen w-full bg-slate-800">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Page Content */}
      <div className="drawer-content flex flex-col overflow-hidden">
        <Navbar />

        {/* This container will hold the background image and the notes section */}
        <div
          className="relative flex-1 bg-cover bg-center bg-fixed overflow-auto"
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-15">
            <img src={BgImage} className='w-full bg-cover bg-fixed' alt="background" />

          </div>

          {/* Main content area (notes) */}
          <main className="relative z-0 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-white">Your bible notes</h1>
              <button
                className="btn bg-teal-600 btn-sm hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-md flex items-center gap-2"
                onClick={openModal}
              >
                <FaPlus /> Add bible
              </button>
            </div>

            {
                isLoading && 
                <div className="text-center text-white text-xl">
                    <span className="loading loading-ring loading-xs"></span>
                    <span className="loading loading-ring loading-sm"></span>
                    <span className="loading loading-ring loading-md"></span>
                    <span className="loading loading-ring loading-lg"></span>
                    <span className="loading loading-ring loading-xl"></span>
                </div>
            }
            {error && <div className="text-center text-red-400 text-xl">Error: {error}</div>}
            {!isLoading && !error && verses.length === 0 && (
              <div className="text-center text-slate-400 text-xl mt-10">No verses found. Click "Add New Note" to get started!</div>
            )}

            {!isLoading && !error && verses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verses.map(note => (
                  <NoteCard
                    key={note.id}
                    id={note.id} // Pass the note's ID
                    book={note.book}
                    chapter={note.chapter}
                    verse={note.verse}
                    verse_text={note.verse_text}
                    note={note.note}
                    tags={note.tags}
                    created_at={note.created_at}
                    // Pass the action handlers
                    // onView={handleViewNote}
                    // onEdit={handleEditNote}
                    // onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Drawer Sidebar Content */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <FilterDrawerContent />
      </div>

      {/* New Note Modal */}
      {showModal && (
        <dialog id="add_note_modal" className="modal modal-open">
          <div className="modal-box bg-slate-700 text-white p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl mb-6 text-teal-300 text-center">Add New Bible Note</h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              {/* Book Select */}
              <div>
                <BookSelect
                  value={newNoteBook}
                  onChange={(e) => setNewNoteBook(e.target.value)}
                />
              </div>

              {/* Chapter Input */}
              <div>
                <label className="label text-slate-300">Chapter</label>
                <input
                  type="number"
                  placeholder="e.g., 1"
                  className="input input-bordered w-full bg-slate-600 text-white focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteChapter}
                  onChange={(e) => setNewNoteChapter(e.target.value)}
                  min="1"
                  required
                />
              </div>

              {/* Verse Input (text, for ranges like 1-3) */}
              <div>
                <label className="label text-slate-300">Verse (e.g., 1 or 1-3)</label>
                <input
                  type="text"
                  placeholder="e.g., 1 or 1-3"
                  className="input input-bordered w-full bg-slate-600 text-white focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteVerse}
                  onChange={(e) => setNewNoteVerse(e.target.value)}
                  required
                />
              </div>

              {/* Verse Text Input */}
              <div>
                <label className="label text-slate-300">Verse Text</label>
                <textarea
                  placeholder="The actual verse text..."
                  className="textarea textarea-bordered w-full bg-slate-600 text-white h-24 focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteVerseText}
                  onChange={(e) => setNewNoteVerseText(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Your Note Input */}
              <div>
                <label className="label text-slate-300">Your Note</label>
                <textarea
                  placeholder="Your personal reflection or insight..."
                  className="textarea textarea-bordered w-full bg-slate-600 text-white h-36 focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteNote}
                  onChange={(e) => setNewNoteNote(e.target.value)}
                  required
                ></textarea>
              </div>

              {/* Modern Tags Input */}
              <div>
                <label className="label text-slate-300">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-teal-600 text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-teal-700 transition duration-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 -mr-1 text-white hover:text-red-200"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type tag and press Enter or Comma"
                  className="input input-bordered w-full bg-slate-600 text-white focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={currentTagInput}
                  onChange={(e) => setCurrentTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={handleTagInputBlur}
                />
              </div>

              <div className="modal-action mt-6">
                <button type="button" className="btn btn-ghost text-slate-300 hover:bg-slate-600" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn bg-teal-600 hover:bg-teal-700 text-white">Save Note</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}