const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

// Controllers
const { getCourses } = require("../controllers/courseController");
const { getLectures } = require("../controllers/lectureController");
const { getMyAttendance } = require("../controllers/attendanceController");
const studentController = require("../controllers/studentController.js");
const quizController = require("../controllers/quizController.js");

router.get("/notifications/unread-count", protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      student: req.user._id, 
      isRead: false 
    });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Get All Notifications 
router.get("/notifications", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ student: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put("/notifications/mark-as-read", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { student: req.user._id, isRead: false },
      { 
        $set: { 
          isRead: true,
          updatedAt: new Date() 
        } 
      }
    );
    res.json({ success: true, message: "Marked as read. Will disappear in 30 mins." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/dashboard", protect, studentController.getStudentDashboardData); 
router.get("/my-attendance", protect, getMyAttendance); 
router.get("/lectures", protect, getLectures); 
router.get("/my-assignments", protect, studentController.getStudentAssignments);

// --- Admin & Student Management ---
router.get("/", protect, studentController.getStudents);
router.post("/", protect, studentController.addStudent);
router.get("/:id", protect, studentController.getStudentDetails);
router.put("/:id", protect, studentController.updateStudent);
router.delete("/:id", protect, studentController.deleteStudent);
router.post("/:id/status", protect, studentController.toggleStudentStatus);

// --- Operations ---
router.post("/enroll", protect, studentController.enrollInCourse);
router.post("/submit-quiz", protect, quizController.submitQuiz);
router.post("/submit-assignment", protect, studentController.submitAssignment);
router.put("/complete-setup", protect, studentController.completeProfileSetup);
router.post("/update-access", protect, studentController.updateLastAccessed);
router.post("/complete-lecture", protect, studentController.completeLecture);

router.get("/course/:courseId/demo", studentController.getDemoVideoByCourse);

module.exports = router;