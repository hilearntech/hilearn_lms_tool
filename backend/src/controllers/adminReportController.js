const User = require("../models/User");
const Batch = require("../models/Batch");
const Attendance = require("../models/Attendance");
const Lecture = require("../models/Lecture");

exports.getAdminReports = async (req, res) => {
  try {
   
    const totalStudents = await User.countDocuments({ role: "student" });
    const activeBatches = await Batch.countDocuments({ isActive: true });
    
    const totalAttendanceDocs = await Attendance.countDocuments();
    const presentDocs = await Attendance.countDocuments({ status: "present" });
    const avgAttendanceOverall = totalAttendanceDocs > 0 
      ? Math.round((presentDocs / totalAttendanceDocs) * 100) 
      : 0;

    
    const batches = await Batch.find({ isActive: true }).select("name students");
    const batchWiseAttendance = [];

    for (let batch of batches) {
      const studentIds = batch.students || [];
      const totalRecords = await Attendance.countDocuments({ student: { $in: studentIds } });
      const presentRecords = await Attendance.countDocuments({ 
        student: { $in: studentIds }, 
        status: "present" 
      });

      const percentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

      batchWiseAttendance.push({
        name: batch.name,
        attendance: percentage
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const admissionsTrend = await User.aggregate([
      { $match: { role: "student", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrend = admissionsTrend.map(item => ({
      name: monthNames[item._id - 1],
      admissions: item.count
    }));

    
    const topStudents = await User.find({ role: "student" })
      .limit(5)
      .select("name email")
      .lean();

    const formattedTopStudents = topStudents.map(student => ({
      ...student,
      score: Math.floor(Math.random() * 20) + 80 
    }));

    // 5. Low Attendance Students (Alert)
    const lowAttendanceAlert = await Attendance.aggregate([
      { $group: { _id: "$student", count: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } } } },
      { $project: { percentage: { $multiply: [{ $divide: ["$present", "$count"] }, 100] } } },
      { $match: { percentage: { $lt: 60 } } },
      { $limit: 5 }
    ]);

    
    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeBatches,
        avgAttendanceOverall
      },
      batchWiseAttendance,
      admissionsTrend: formattedTrend,
      topStudents: formattedTopStudents,
      lowAttendanceAlert
    });

  } catch (error) {
    console.error("Report API Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};