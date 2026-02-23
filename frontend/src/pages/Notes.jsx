import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import NoteCard from "../components/NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axiosInstance.get("/notes");
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

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-muted">Loading notes...</h4>
      </div>
    );
  }

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
              <NoteCard note={note} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;