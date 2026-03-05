const User = require("../models/User");
const Note = require("../models/Note");
const cloudinary = require("../config/cloudinary");

exports.uploadNote = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, subject, branch, year, tags } = req.body;

    if (!title || !subject || !branch || !year) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Upload file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "CampusVault",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const note = await Note.create({
      title,
      description,
      subject,
      branch,
      year: Number(year),
      tags: tags ? tags.split(",") : [],
      fileUrl: result.secure_url,
      uploadedBy: req.user._id,
    });

    res.status(201).json(note);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { branch, year, subject, search, page = 1, limit = 5 } = req.query;

    let query = {};

    // Filtering
    if (branch) query.branch = branch;
    if (year) query.year = Number(year);
    if (subject) query.subject = subject;

    // Search (case insensitive)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const notes = await Note.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Note.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      notes,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.toggleUpvote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const userId = req.user._id.toString();

    const alreadyUpvoted = note.upvotes.some(
      (id) => id.toString() === userId
    );

    if (alreadyUpvoted) {
      note.upvotes = note.upvotes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      note.upvotes.push(userId);
    }

    await note.save();

    const updatedNote = await Note.findById(note._id)
      .populate("uploadedBy", "name email");

    res.json({
      message: "Vote updated",
      note: updatedNote
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const userId = req.user._id.toString();

    const alreadyDownloaded = note.downloadUsers.some(
      (id) => id.toString() === userId
    );

    // Only update analytics if first download
    if (!alreadyDownloaded) {
      note.downloads += 1;
      note.downloadUsers.push(userId);
      await note.save();
    }

    // ALWAYS allow download
    res.json({
      fileUrl: note.fileUrl,
      downloads: note.downloads
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const noteId = req.params.id;

    const alreadyBookmarked = user.bookmarks.includes(noteId);

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== noteId.toString()
      );
    } else {
      user.bookmarks.push(noteId);
    }

    await user.save();

    res.json({
      message: alreadyBookmarked ? "Bookmark removed" : "Bookmarked",
      totalBookmarks: user.bookmarks.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("bookmarks");

    res.json(user.bookmarks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};