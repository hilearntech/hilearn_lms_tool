const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); 
const { 
  markBulkAttendance, 
  getFilteredStudents, 
  getMyAttendance 
} = require("../controllers/attendanceController");

/**
 * @route GET /api/attendance/my-attendance
 * Student apni attendance dekhne ke liye iska use karega
 */
router.get("/my-attendance", protect, getMyAttendance);

/**
 * @route GET /api/attendance/filtered-students/:lectureId
 * Admin jab lecture select karega tab enrolled students lane ke liye
 */
router.get("/filtered-students/:lectureId", protect, getFilteredStudents);

/**
 * @route POST /api/attendance/bulk
 * Admin attendance mark karne ke liye is route ka use karega
 */
router.post("/bulk", protect, markBulkAttendance);

module.exports = router;