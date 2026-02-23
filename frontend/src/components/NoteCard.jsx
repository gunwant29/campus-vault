import { useAuth } from "../context/AuthContext";

const NoteCard = ({ note }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="card card-custom shadow-soft h-100 p-3">
      <h5 className="fw-bold">{note.title}</h5>

      <p className="text-muted small mb-1">
        {note.subject} • Year {note.year}
      </p>

      <p className="text-muted small">
        Uploaded by {note.uploadedBy?.name}
      </p>

      <p className="text-muted">
        {note.description}
      </p>

      <div className="mt-auto d-flex justify-content-between align-items-center">
        <span className="badge bg-light text-dark">
          {note.tags?.join(", ")}
        </span>

        <div>
          {isAuthenticated && (
            <button className="btn btn-sm btn-outline-primary me-2">
              👍 {note.upvotes?.length}
            </button>
          )}

          <a
            href={note.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-primary-custom text-white"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;