const express = require("express");
const { uploadNote } = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getNotes } = require("../controllers/noteController");

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadNote);
router.get("/", getNotes);

module.exports = router;