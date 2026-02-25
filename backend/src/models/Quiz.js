const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }], 
      correctAnswer: { type: String, required: true }, 
    }
  ],
  duration: { type: String, default: "15 min" }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", quizSchema);