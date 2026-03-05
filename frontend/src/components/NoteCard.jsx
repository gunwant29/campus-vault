import { useAuth } from "../context/AuthContext";
import { upvoteNote, downloadNote } from "../services/noteService";

const NoteCard = ({ note, onUpvote, onDownload }) => {
  const { isAuthenticated } = useAuth();

  const handleUpvote = async () => {
    try {
      const res = await upvoteNote(note._id);
      onUpvote(res.data.note); // send updated note to parent
    } catch (error) {
      console.error("Upvote failed:", error);
    }
  };
  const handleDownload = async () => {
    try {
      const res = await downloadNote(note._id);

      window.open(res.data.fileUrl, "_blank");

      onDownload({
        ...note,
        downloads: res.data.downloads
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card card-custom shadow-soft h-100 p-3">
      <h5 className="fw-bold">{note.title}</h5>

      <p className="text-muted small mb-1">
        {note.subject} • Year {note.year}
      </p>

      <p className="text-muted small">
        Uploaded by {note.uploadedBy?.name}
      </p>

      <p className="text-muted">{note.description}</p>

      <div className="mt-auto d-flex justify-content-between align-items-center">
        <span className="badge bg-light text-dark">
          {note.tags?.join(", ")}
        </span>

        <div className="d-flex align-items-center">

          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={handleUpvote}
          >
            👍 {note.upvotes?.length || 0}
          </button>

          <span className="text-muted me-2">
            ⬇ {note.downloads || 0}
          </span>

          <button
            className="btn btn-sm btn-primary-custom"
            onClick={handleDownload}
          >
            Download
          </button>

        </div>
      </div>
    </div>
  );
};

export default NoteCard;