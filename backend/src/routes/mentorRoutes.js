const express = require("express");
const router = express.Router();
const multer = require("multer");   
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const { 
  getMentorStats, 
  getMyLectures, 
  getStudentPerformance,
  getMentorProfile ,
  createAssignment,           
  getAssignmentSubmissions,    
  evaluateSubmission,    
  updateAssignment,
  deleteAssignment,
  getMentorCourses,
  // getMentorProfile      
} = require("../controllers/mentorController");
const { protect } = require("../middleware/authMiddleware");

// 1. Dashboard Stats
router.get("/profile", protect, getMentorProfile);
router.get("/stats", protect, getMentorStats);

// 2. Lectures
router.get("/my-lectures", protect, getMyLectures);
router.get("/my-assigned-lectures", protect, getMyLectures);

// 3. Student Performance Tracking 
router.get("/student-performance", protect, getStudentPerformance);

router.get("/profile", protect, getMentorProfile);
// 4. Assignment Management 
router.post("/create-assignment", protect, upload.single("image"), createAssignment);
router.get("/assignments", protect, getAssignmentSubmissions);
router.post("/evaluate-assignment", protect, evaluateSubmission);
router.put("/update-assignment/:id", protect, upload.single("image"), updateAssignment);
router.delete("/delete-assignment/:id", protect, deleteAssignment);
router.get("/my-courses", protect, getMentorCourses);

module.exports = router;