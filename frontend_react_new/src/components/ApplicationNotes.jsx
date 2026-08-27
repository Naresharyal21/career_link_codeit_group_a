import { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicationNotes = ({ applicationId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [applicationId]);

  const fetchNotes = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/v1/applications/notes/', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setNotes(response.data.filter(function(n) { return n.application === applicationId; }));
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
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
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-semibold mb-2">Internal Notes</h4>
      <div className="space-y-2 mb-4">
        {notes.map(function(note) {
          return <div key={note.id} className="text-sm bg-white p-2 rounded border">{note.note}</div>
        })}
      </div>
      <form onSubmit={handleAddNote} className="flex gap-2">
        <input 
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)} 
          className="flex-grow p-2 border rounded"
          placeholder="Add internal note..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
    </div>
  );
};

export default ApplicationNotes;
