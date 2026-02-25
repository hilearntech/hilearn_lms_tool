const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  title: String,
  type: {
    type: String,
    enum: ["notes", "quiz", "interview"],
    required: true,
  },
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Material", materialSchema);
