// pages/NotePage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import FilterDrawerContent from "../components/FilterDrawerContent";
import NoteCard from "../components/NoteCard";
import BookSelect from '../components/BookSelect';
import ChapterSelect from '../components/ChapterSelect';
import VerseSelect from '../components/MultiVerseSelect';
import { FaPlus, FaTimes } from 'react-icons/fa';
import BgImage from '../assets/images/P23.jpg';
import { useBibleVerses } from '../contexts/BibleContext';
import Alert from '../components/Alert';
import { fetchBibleBooks, fetchBibleChapters, fetchBibleVerses } from '../api/bible/bookApi';
// Add this before your component definition
function stripHtml(html) {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const STATIC_TAGS = ["inspiration", "faith", "grace", "love", "hope", "strength", "wisdom", "peace", "joy", "patience"];

export default function NotePage() {
  const {
    verses, isLoading, error,
    addVerse, updateVerse, removeVerse
  } = useBibleVerses();

  // Book selection
  const [bookOptions, setBookOptions] = useState([]);
  const [bookIdToName, setBookIdToName] = useState({});
  const [newNoteBookId, setNewNoteBookId] = useState('');
  const [newNoteBook, setNewNoteBook] = useState(''); // full name

  // Chapter and verse selection
  const [chapterOptions, setChapterOptions] = useState([]);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [newNoteChapterId, setNewNoteChapterId] = useState('');
  const [newNoteChapter, setNewNoteChapter] = useState(''); // number only
  const [verseOptions, setVerseOptions] = useState([]);
  const [verseLoading, setVerseLoading] = useState(false);
  const [newNoteVerse, setNewNoteVerse] = useState([]); // array of verse IDs

  // Other note fields
  const [newNoteVerseText, setNewNoteVerseText] = useState('');
  const [newNoteNote, setNewNoteNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "success", message: "" });

  // Fetch books on mount
  useEffect(() => {
    fetchBibleBooks().then(books => {
      setBookOptions(books);
      const map = {};
      books.forEach(b => { map[b.value] = b.label; });
      setBookIdToName(map);
    });
  }, []);

  // Fetch chapters when book changes
  useEffect(() => {
    if (newNoteBookId) {
      setChapterLoading(true);
      fetchBibleChapters(newNoteBookId)
        .then(chapters => {
          setChapterOptions(chapters);
        })
        .catch(() => setChapterOptions([]))
        .finally(() => setChapterLoading(false));
    } else {
      setChapterOptions([]);
      setNewNoteChapterId('');
      setNewNoteChapter('');
    }
  }, [newNoteBookId]);

  // Fetch verses when chapter changes
  useEffect(() => {
    if (newNoteBookId && newNoteChapterId) {
      setVerseLoading(true);
      fetchBibleVerses(newNoteBookId, newNoteChapterId)
        .then(verses => setVerseOptions(verses))
        .catch(() => setVerseOptions([]))
        .finally(() => setVerseLoading(false));
    } else {
      setVerseOptions([]);
      setNewNoteVerse([]);
    }
  }, [newNoteBookId, newNoteChapterId]);

  // Update verse text when verses are selected
  useEffect(() => {
    // Only fetch if all required fields are selected and at least one verse is selected
    if (newNoteBookId && newNoteChapterId && newNoteVerse.length > 0) {
      // Fetch all selected verse texts in parallel
      Promise.all(
        newNoteVerse.map(verseId =>
          fetch(`https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/verses/${verseId}`, {
            headers: {
              "api-key": "6240194b815c6cc745103921354bf9fa",
              "accept": "application/json"
            }
          })
            .then(res => res.ok ? res.json() : null)
            .then(data => stripHtml(data?.data?.content || ""))
        )
      ).then(verseTexts => {
        setNewNoteVerseText(verseTexts.join(" "));
      });
    } else {
      setNewNoteVerseText("");
    }
  }, [newNoteBookId, newNoteChapterId, newNoteVerse]);

  // --- Modal and Tag Management Functions ---
  const openModal = (note) => {
    setShowModal(true);
    if (note) {
      setEditingNoteId(note.id);
      // Find the book ID from the full name
      const bookId = Object.keys(bookIdToName).find(key => bookIdToName[key] === note.book) || '';
      setNewNoteBookId(bookId);
      setNewNoteBook(note.book);
      // For chapter, try to find the chapterId from options
      setNewNoteChapterId(note.chapterId || '');
      setNewNoteChapter(note.chapter);
      setNewNoteVerse(Array.isArray(note.verse) ? note.verse : (note.verse ? note.verse.split(',') : []));
      setNewNoteVerseText(note.verse_text);
      setNewNoteNote(note.note);
      setSelectedTags(Array.isArray(note.tags) ? note.tags : (note.tags ? note.tags.split(',').map(t => t.trim()) : []));
    } else {
      setEditingNoteId(null);
      setNewNoteBookId('');
      setNewNoteBook('');
      setNewNoteChapterId('');
      setNewNoteChapter('');
      setNewNoteVerse([]);
      setNewNoteVerseText('');
      setNewNoteNote('');
      setSelectedTags([]);
    }
    setCurrentTagInput('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNoteId(null);
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

  // Edit handler
  const handleEditNote = (id) => {
    const note = verses.find(v => v.id === id);
    if (note) openModal(note);
  };

  // Delete handler
  const handleDeleteNote = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      await removeVerse(pendingDeleteId);
      setAlert({ show: true, type: "success", message: "Note deleted successfully!" });
    } catch (err) {
      setAlert({ show: true, type: "error", message: err.error || err.message || "Failed to delete note" });
    }
    setPendingDeleteId(null);
  };

  // Optional: View handler (not implemented)
  const handleViewNote = (id) => {
    // Implement as needed
  };

  // Helper to extract chapter number from chapterId string (e.g., "GEN.1" => "1")
  const getChapterNumber = (chapterId) => {
    if (!chapterId) return "";
    const parts = chapterId.split(".");
    return parts[parts.length - 1];
  };

  // Helper to extract verse numbers from verse IDs (e.g., ["GEN.1.1", "GEN.1.2"] => "1,2")
  const getVerseNumbers = (verseIds) => {
    if (!verseIds) return "";
    if (Array.isArray(verseIds)) {
      return verseIds.map(id => id.split(".").pop()).join(",");
    }
    return verseIds.split(".").pop();
  };

  // Helper to display verse numbers as a range or comma-separated
  function displayVerseRange(verseIds) {
    if (!verseIds || verseIds.length === 0) return "";
    const numbers = verseIds.map(id => parseInt(id.split('.').pop(), 10)).sort((a, b) => a - b);
    if (numbers.length === 1) return `${numbers[0]}`;
    // Check if sequential
    const isSequential = numbers.every((num, idx, arr) => idx === 0 || num === arr[idx - 1] + 1);
    if (isSequential) return `${numbers[0]}-${numbers[numbers.length - 1]}`;
    return numbers.join(",");
  }

  const handleSaveNote = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    try {
      const tagsString = selectedTags.join(',');
      const chapterNumber = getChapterNumber(newNoteChapterId);
      const versesString = getVerseNumbers(newNoteVerse);

      if (editingNoteId) {
        await updateVerse(editingNoteId, {
          book: newNoteBook,
          chapter: chapterNumber,
          verse: versesString,
          verse_text: newNoteVerseText,
          note: newNoteNote,
          tags: tagsString,
        });
        setAlert({ show: true, type: "success", message: "Note updated successfully!" });
      } else {
        await addVerse({
          book: newNoteBook,
          chapter: chapterNumber,
          verse: versesString,
          verse_text: newNoteVerseText,
          note: newNoteNote,
          tags: tagsString,
        });
        setAlert({ show: true, type: "success", message: "Note added successfully!" });
      }
      setShowModal(false);
      setEditingNoteId(null);
    } catch (err) {
      setFieldErrors(err.details || {});
      setFormError(err.error || err.message || "Failed to save note");
    }
  };

  return (
    <div className="drawer lg:drawer-open h-screen w-full bg-slate-800">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Page Content */}
      <div className="drawer-content flex flex-col overflow-hidden">
        <Navbar />

        {/* This container will hold the background image and the notes section */}
        <div className="relative flex-1 bg-cover bg-center bg-fixed overflow-auto">
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black opacity-15">
            <img src={BgImage} className='w-full bg-cover bg-fixed' alt="background" />
          </div>

          {/* Main content area (notes) */}
          <main className="relative z-0 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Your verses</h1>
              <button
                className="btn bg-teal-600 btn-sm hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-md flex items-center gap-2"
                onClick={() => openModal()}
              >
                <FaPlus /> Add bible
              </button>
            </div>

            {isLoading && (
              <div className="text-center text-white text-xl">
                <span className="loading loading-ring loading-xs"></span>
                <span className="loading loading-ring loading-sm"></span>
                <span className="loading loading-ring loading-md"></span>
                <span className="loading loading-ring loading-lg"></span>
                <span className="loading loading-ring loading-xl"></span>
              </div>
            )}
            {error && <div className="text-center text-red-400 text-xl">Error: {error}</div>}
            {!isLoading && !error && verses.length === 0 && (
              <div className="text-center text-slate-400 text-xl mt-10">No verses found. Click "Add New Note" to get started!</div>
            )}

            {!isLoading && !error && verses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verses.map(note => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    book={note.book}
                    chapter={note.chapter}
                    verse={note.verse}
                    verse_text={note.verse_text}
                    note={note.note}
                    tags={note.tags}
                    created_at={note.created_at}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onView={handleViewNote}
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

      {/* Add/Edit Note Modal */}
      {showModal && (
        <dialog id="add_note_modal" className="modal modal-open">
          <div className="modal-box bg-slate-700 text-white p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-2xl mb-6 text-teal-300 text-center">
              {editingNoteId ? "Edit Bible Note" : "Add New Bible Note"}
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              {/* Book Select */}
              <div>
                <BookSelect
                  value={newNoteBookId}
                  onChange={e => {
                    setNewNoteBookId(e.target.value);
                    setNewNoteBook(bookIdToName[e.target.value] || "");
                  }}
                  options={bookOptions}
                />
                {fieldErrors.book && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.book.join(", ")}</div>
                )}
              </div>

              {/* Chapter Input */}
              <div>
                <label className="label text-slate-300">Chapter</label>
                <ChapterSelect
                  value={newNoteChapterId}
                  onChange={e => {
                    setNewNoteChapterId(e.target.value);
                    setNewNoteChapter(getChapterNumber(e.target.value));
                  }}
                  options={chapterOptions}
                  loading={chapterLoading}
                />
                {fieldErrors.chapter && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.chapter.join(", ")}</div>
                )}
              </div>

              {/* Verse Input */}
              <div>
                <label className="label text-slate-300">Verse (select one or more)</label>
                {/* Display selected verses as a range or list */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(newNoteVerse) && newNoteVerse.length > 0 && (
                    <span className="inline-flex items-center bg-teal-600 text-white text-sm px-3 py-1 rounded-full">
                      {displayVerseRange(newNoteVerse)}
                      <button
                        type="button"
                        className="ml-2 text-white hover:text-red-200"
                        onClick={() => setNewNoteVerse([])}
                        aria-label="Clear verses"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
                <VerseSelect
                  value={newNoteVerse}
                  onChange={setNewNoteVerse}
                  options={verseOptions}
                  loading={verseLoading}
                />
                {fieldErrors.verse && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.verse.join(", ")}</div>
                )}
              </div>

              {/* Verse Text Input */}
              <div>
                <label className="label text-slate-300">Verse Text</label>
                <textarea
                  placeholder="The actual verse text..."
                  className="textarea textarea-bordered w-full bg-slate-600 text-white h-24 focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteVerseText}
                  onChange={(e) => setNewNoteVerseText(e.target.value)}
                ></textarea>
                {fieldErrors.verse_text && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.verse_text.join(", ")}</div>
                )}
              </div>

              {/* Your Note Input */}
              <div>
                <label className="label text-slate-300">Your Note</label>
                <textarea
                  placeholder="Your personal reflection or insight..."
                  className="textarea textarea-bordered w-full bg-slate-600 text-white h-36 focus:ring-teal-300 focus:border-transparent rounded-lg"
                  value={newNoteNote}
                  onChange={(e) => setNewNoteNote(e.target.value)}
                ></textarea>
                {fieldErrors.note && (
                  <div className="text-red-400 text-xs mt-1">{fieldErrors.note.join(", ")}</div>
                )}
              </div>

              {/* Tags Input */}
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

                {/* Static tag suggestions */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {STATIC_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-2 py-1 rounded-full text-xs border ${selectedTags.includes(tag) ? "bg-teal-600 text-white" : "bg-slate-500 text-white hover:bg-teal-400"}`}
                      onClick={() => {
                        if (!selectedTags.includes(tag)) setSelectedTags([...selectedTags, tag]);
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="text-red-400 text-sm mb-2">{formError}</div>
              )}
              {Object.values(fieldErrors).length > 0 && (
                <div className="text-red-400 text-sm mb-2">
                  {Object.values(fieldErrors).flat().join(" ")}
                </div>
              )}

              <div className="modal-action mt-6">
                <button type="button" className="btn btn-ghost text-slate-300 hover:bg-slate-600" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn bg-teal-600 hover:bg-teal-700 text-white">
                  {editingNoteId ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {/* Confirmation Dialog for Deletion */}
      {showConfirm && (
        <dialog id="confirm_delete_modal" className="modal modal-open">
          <div className="modal-box bg-slate-700 text-white p-6 rounded-lg shadow-xl">
            <h3 className="font-bold text-xl mb-4 text-red-400 text-center">Confirm Deletion</h3>
            <p className="text-center text-slate-300 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="btn btn-ghost text-slate-300 hover:bg-slate-600"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDelete}
              >
                Delete Note
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Alert Toast */}
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}
    </div>
  );
}