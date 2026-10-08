import { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationNotes = ({ applicationId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [applicationId]);

  const fetchNotes = async () => {
    const token = sessionStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/v1/applications/notes/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      // Assuming response.data could be paginated or an array
      const notesData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      setNotes(notesData.filter(n => n.application === applicationId));
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const token = sessionStorage.getItem('access_token');
    try {
      await axios.post('http://localhost:8000/api/v1/applications/notes/', 
        { application: applicationId, note: newNote },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setNewNote('');
      fetchNotes();
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Internal Notes
      </h4>
      
      {notes.length > 0 ? (
        <div className="space-y-3 mb-4">
          {notes.map(note => (
            <div key={note.id} className="text-sm bg-blue-50/50 text-gray-700 p-3 rounded-xl border border-blue-100 leading-relaxed shadow-sm">
              {note.note}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic mb-4">No notes added yet.</p>
      )}

      <form onSubmit={handleAddNote} className="flex gap-2">
        <input 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
          className="form-input flex-grow text-sm py-2"
          placeholder="Add an internal note..."
        />
        <button type="submit" className="btn-secondary whitespace-nowrap text-xs">
          Add Note
        </button>
      </form>
    </div>
  );
};

export default ApplicationNotes;
