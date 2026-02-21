const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
    },
    year: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    bookmarks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  }
]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);