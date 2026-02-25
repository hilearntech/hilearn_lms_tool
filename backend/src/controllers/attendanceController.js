const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Lecture = require("../models/Lecture");

/**
 * @desc Get students who bought the course linked to the lecture (Used by Mentors)
 * @route GET /api/attendance/filtered-students/:lectureId
 */
exports.getFilteredStudents = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    const students = await User.find({
      role: "student",
      enrolledCourses: { $in: [lecture.course] } 
    }).select("name email");

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

/**
 * @desc Mark Bulk Attendance for a specific lecture (Used by Mentors)
 * @route POST /api/attendance/bulk
 */
exports.markBulkAttendance = async (req, res) => {
  try {
    const { lectureId, attendanceData } = req.body;

    if (!lectureId || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ 
        success: false, 
        message: "Lecture ID and Attendance Data are required." 
      });
    }

    const records = attendanceData.map(item => ({
      lecture: lectureId,
      student: item.studentId,
      status: item.status
    }));

    await Attendance.deleteMany({ lecture: lectureId });
    await Attendance.insertMany(records);

    res.status(200).json({ 
      success: true, 
      message: "Attendance updated successfully!" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error: " + error.message 
    });
  }
};

/**
 * @desc Get attendance records for the logged-in student
 * @route GET /api/attendance/my-attendance
 * ADDED THIS TO FIX STUDENT SIDE VIEW
 */
exports.getMyAttendance = async (req, res) => {
  try {
    
    if (req.user.role === "student") {
      const records = await Attendance.find({ student: req.user._id })
        .populate({
          path: "lecture",
          populate: { path: "course" } 
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: records.length,
        attendance: records
      });
    }

    
    const allRecords = await Attendance.find().populate("lecture student");
    res.status(200).json({ success: true, attendance: allRecords });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};