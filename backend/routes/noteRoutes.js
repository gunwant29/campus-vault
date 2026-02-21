const express = require("express");
const { uploadNote } = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getNotes } = require("../controllers/noteController");
const { toggleUpvote } = require("../controllers/noteController");
const { downloadNote } = require("../controllers/noteController");
const { toggleBookmark } = require("../controllers/noteController");
const { getUserBookmarks } = require("../controllers/noteController");

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadNote);
router.get("/", getNotes);
router.put("/:id/upvote", protect, toggleUpvote);
router.get("/:id/download", downloadNote);
router.get("/bookmarks/me", protect, getUserBookmarks);
router.put("/:id/bookmark", protect, toggleBookmark);

module.exports = router;