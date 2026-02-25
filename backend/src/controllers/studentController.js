const mongoose = require("mongoose");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Lecture = require("../models/Lecture");
const Assignment = require("../models/Assignment");
const QuizResult = require("../models/QuizResult");
const bcrypt = require("bcryptjs");
const Announcement = require("../models/Announcement");
const LectureProgress = require("../models/LectureProgress");


exports.getStudentDashboardData = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    
    
    const student = await User.findById(studentId)
      .populate("enrolledCourses")
      .populate("lastAccessedLecture"); 

    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const courseIds = student.enrolledCourses.map(course => course._id);
    if (courseIds.length === 0) {
      return res.json({ success: true, stats: { enrolledCourse: "No Course Assigned", progress: 0, attendanceRate: 0 } });
    }

   
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

    
    const today = new Date().setHours(0, 0, 0, 0);
    const upcomingLive = await Lecture.find({
      course: { $in: courseIds },
      lectureType: "live",
      date: { $gte: new Date(today).toISOString() } 
    })
    .populate("course", "title") 
    .sort({ date: 1, startTime: 1 }) 
    .limit(2);

    
    const courseNames = student.enrolledCourses.map(course => course.title).join(" & ");
    const allAttendance = await Attendance.find({ student: studentId }).populate("lecture");
    const activeAttendanceRecords = allAttendance.filter(record => record.lecture !== null && record.lecture !== undefined);
    const presentCount = activeAttendanceRecords.filter(r => r.status.toLowerCase() === "present").length;
    const attendanceRate = activeAttendanceRecords.length > 0 ? Math.round((presentCount / activeAttendanceRecords.length) * 100) : 0;

    const totalVideoLectures = await Lecture.countDocuments({ course: { $in: courseIds }, lectureType: "video" });
    const completedCount = student.completedLectures ? student.completedLectures.length : 0;
    const realProgress = totalVideoLectures > 0 ? Math.min(100, Math.round((completedCount / totalVideoLectures) * 100)) : 0;

let continueWatchingData = null;
let lastLecture = student.lastAccessedLecture || 
                  await Lecture.findOne({ course: { $in: courseIds }, lectureType: "video" }).sort({ createdAt: 1 });

if (lastLecture) {
  continueWatchingData = {
    id: lastLecture._id,
    title: lastLecture.title,
    moduleName: lastLecture.lectureType === "video" ? "Video Lecture" : "Live Session",
    thumbnail: lastLecture.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    videoUrl: lastLecture.videoUrl,
    videoID: lastLecture.videoID,   
    libraryID: lastLecture.libraryID || "592909", 
    lastStoppedTime: student.stoppedAt || 0 
  };
}

    res.json({
      success: true,
      stats: {
        enrolledCourse: courseNames,
        totalLectures: totalVideoLectures, 
        attendanceRate: attendanceRate,
        progress: realProgress 
      },
      completedList: student.completedLectures || [],
      enrolledCoursesList: student.enrolledCourses, 
      continueWatching: continueWatchingData,
      announcements: announcements,
      continueWatching: continueWatchingData,
      announcements: announcements,
      upcomingLiveClasses: upcomingLive.map(live => ({
        id: live._id,
        topic: live.title,
        courseName: live.course?.title,
        date: new Date(live.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        time: live.startTime || "TBA",
        meetingLink: live.meetingLink || live.videoUrl,
        zoomDetails: live.zoomDetails ? { 
          meeting_id: live.zoomDetails.meeting_id,
          password: live.zoomDetails.password
        } : null
      })),
      certificates: student.certificates || []
    });

  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const records = await Attendance.find({ student: studentId })
      .populate({ path: "lecture", select: "title date" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalPresent: records.filter(r => r.status.toLowerCase() === "present").length,
      totalLectures: records.length,
      attendance: records
    });
  } catch (error) { 
    res.status(500).json({ success: false, message: "Attendance error: " + error.message }); 
  }
};


exports.getAllLecturesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const student = await User.findById(studentId).select("enrolledCourses");
    
    if (!student || !student.enrolledCourses || student.enrolledCourses.length === 0) {
      return res.json({ success: true, lectures: [], message: "No courses enrolled" });
    }

    const lectures = await Lecture.find({ course: { $in: student.enrolledCourses } })
      .sort({ createdAt: -1 })
      .populate("course", "title"); 

    res.status(200).json({ success: true, lectures });
  } catch (error) { 
    res.status(500).json({ success: false, message: "Internal Server Error" }); 
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const student = await User.findById(studentId);
    
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

   
    const enrolledIds = student.enrolledCourses.map(id => id.toString());
    
    const assignments = await Assignment.find({ course: { $in: enrolledIds } })
      .populate("mentor", "name")
      .populate("course", "title")
      .select("title description course mentor deadline image submissions") 
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: assignments.length,
      data: assignments 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionLink } = req.body;
    const studentId = req.user.id || req.user._id;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const alreadySubmitted = assignment.submissions.some(s => s.student.toString() === studentId.toString());
    if (alreadySubmitted) return res.status(400).json({ message: "Already submitted!" });

    assignment.submissions.push({ student: studentId, submissionLink, submittedAt: new Date() });
    await assignment.save();
    
    res.status(200).json({ success: true, message: "Submitted successfully!" });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};


exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
    res.json(students);
  } catch (error) { res.status(500).json({ message: "Error" }); }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, mobile, password, enrolledCourse } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({ 
      name, 
      email, 
      mobile, 
      password: hashedPassword, 
      role: "student", 
      isActive: true,
      isFirstLogin: true,
      enrolledCourses: enrolledCourse ? [enrolledCourse] : []
    });
    res.status(201).json(student);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) updateData.password = await bcrypt.hash(updateData.password, 10);
    const student = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    res.json({ success: true, student });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.toggleStudentStatus = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    student.isActive = !student.isActive;
    await student.save();
    res.json({ success: true, isActive: student.isActive });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.deleteStudent = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.getStudentDetails = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select("-password").populate("enrolledCourses");
    res.json({ success: true, student });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.id })
      .populate("lecture", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, attendance });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.getStudentQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizResult.find({ student: req.params.id });
    res.json(quizzes);
  } catch (error) { res.status(500).json({ message: "Error" }); }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { courseId } = req.body;
    const student = await User.findById(studentId);
    
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled!" });
    }
    
    student.enrolledCourses.push(courseId);
    await student.save();
    res.status(200).json({ success: true, message: "Enrolled!" });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

exports.seedStudents = async (req, res) => {
  try { res.status(201).json({ success: true, message: "Seed endpoint hit" }); } 
  catch (error) { res.status(500).json({ success: false }); }
};

exports.completeProfileSetup = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { password, mobile } = req.body;
    
    const updateData = { 
      mobile, 
      isFirstLogin: false 
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      studentId, 
      { $set: updateData }, 
      { new: true }
    ).select("-password");
    
    res.json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLastAccessed = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { lectureId } = req.body;

    await User.findByIdAndUpdate(studentId, {
      lastAccessedLecture: lectureId
    });

    res.json({ success: true, message: "Last accessed updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.completeLecture = async (req, res) => {
  try {
    const studentId = req.user.id || req.user._id;
    const { lectureId } = req.body;

    
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

   
    const student = await User.findById(studentId);
    if (!student.completedLectures.includes(lectureId)) {
      student.completedLectures.push(lectureId);
      await student.save();
    }

    
    await LectureProgress.findOneAndUpdate(
      { student: studentId, lecture: lectureId },
      { 
        student: studentId, 
        lecture: lectureId, 
        course: lecture.course, 
        isCompleted: true 
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Lecture marked as completed!" });
  } catch (error) {
    console.error("Error in completeLecture:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDemoVideoByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const demoVideo = await Lecture.findOne({ 
      course: courseId, 
      isPreviewFree: true, 
      lectureType: "video" 
    });

    if (!demoVideo) return res.status(404).json({ success: false, message: "No demo found" });

    res.json({ success: true, demoVideo });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};