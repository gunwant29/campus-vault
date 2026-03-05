import { useEffect, useState } from "react";
import { getNotes } from "../services/noteService";
import NoteCard from "../components/NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch notes when component loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data.notes);
      } catch (err) {
        console.error(err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Update the note locally after upvote
  const handleUpvote = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  const handleDownload = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-muted">Loading notes...</h4>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 brand-color fw-bold">All Notes</h2>

      {notes.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <h5>No notes available yet.</h5>
          <p>Be the first one to upload!</p>
        </div>
      ) : (
        <div className="row">
          {notes.map((note) => (
            <div key={note._id} className="col-lg-4 col-md-6 mb-4">
              <NoteCard
                note={note}
                onUpvote={handleUpvote}
                onDownload={handleDownload}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;