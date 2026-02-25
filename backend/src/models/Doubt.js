const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    question: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
    },
    answer: {
      type: String,
      default: "", 
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    answerImage: {
      type: String,
      default: null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doubt", doubtSchema);