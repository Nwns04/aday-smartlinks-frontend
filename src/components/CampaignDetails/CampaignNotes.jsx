import React, { useEffect, useState } from "react";
import API from "../../services/api";

const CampaignNotes = ({ campaignId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (!campaignId) return;           // ⬅ wait until we have an ID

  (async () => {
    const res = await API.get(`/logs/${campaignId}`);
    setNotes(res.data);
  })();
}, [campaignId]);

  const submitNote = async () => {
    if (!newNote.trim()) return;
    const res = await API.post(`/logs/${campaignId}`, { message: newNote });
    setNotes([...notes, res.data]);
    setNewNote("");
  };

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-md font-semibold mb-3">Team Notes</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {notes.map((note) => (
          <div key={note._id} className="text-sm text-gray-800 border-b pb-2">
            <strong>{note.userId?.name || "User"}:</strong> {note.message}
          </div>
        ))}
      </div>

      <div className="mt-3 flex">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-l-md"
          placeholder="Add note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          onClick={submitNote}
          className="px-4 bg-indigo-600 text-white rounded-r-md"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CampaignNotes;
