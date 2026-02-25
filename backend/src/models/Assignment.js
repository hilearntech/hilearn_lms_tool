const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  deadline: { type: Date, required: true },
  image: { type: String },  
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      submissionLink: { type: String }, 
      submittedAt: { type: Date, default: Date.now },
      grade: { type: String, default: "Not Graded" }, 
      feedback: { type: String, default: "" } 
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);