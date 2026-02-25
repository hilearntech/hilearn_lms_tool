const mongoose = require("mongoose");

const lectureProgressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  isCompleted: { type: Boolean, default: true },
  watchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LectureProgress", lectureProgressSchema);