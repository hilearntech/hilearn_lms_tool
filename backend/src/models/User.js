const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["student", "mentor", "admin", "superadmin"],
      default: "student",
    },
    enrolledBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    
   
    lastAccessedLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    overallProgress: { type: Number, default: 0 }, 
    attendance: { type: Number, default: 0 },
    certificates: [
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    title: String, 
    url: String,   
    issueDate: { type: Date, default: Date.now },
    issuedBy: String 
  }
],
    
    isActive: { type: Boolean, default: true },
    isFirstLogin: { type: Boolean, default: true },
    mobile: { type: String },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);