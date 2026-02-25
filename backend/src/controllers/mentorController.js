const Lecture = require("../models/Lecture");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const LectureProgress = require("../models/LectureProgress");
const Assignment = require("../models/Assignment"); 
const mongoose = require("mongoose");
const zoomService = require('../servic/zoomService');
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");


exports.getMyLectures = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { courseId } = req.query; 

    let query = {
      $or: [
        { mentor: mentorId },
        { mentor: mentorId.toString() }
      ]
    };

    
    if (courseId) {
      query.course = courseId;
    }

    const lectures = await Lecture.find(query)
      .populate("course", "title")
      .sort({ date: 1, startTime: 1 }); 

    res.status(200).json({
      success: true,
      count: lectures.length,
      lectures
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
};


exports.getMentorStats = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const mentor = await User.findById(mentorId).populate("enrolledBatches");

    const lectureCount = await Lecture.countDocuments({ mentor: mentorId });

    let studentIds = new Set();
    if (mentor.enrolledBatches) {
      mentor.enrolledBatches.forEach(batch => {
        batch.students.forEach(id => studentIds.add(id.toString()));
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        lectures: lectureCount,
        students: studentIds.size, 
        batches: mentor.enrolledBatches?.length || 0 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentPerformance = async (req, res) => {
  try {
    const mentorId = req.user._id;

   
    const mentorLectures = await Lecture.find({ mentor: mentorId }).select("course");
    const mentorCourseIds = [...new Set(mentorLectures.map(l => l.course.toString()))];

  
    const students = await User.find({
      role: "student",
      enrolledCourses: { $in: mentorCourseIds }
    }).select("name email enrolledCourses completedLectures");

    const performanceData = await Promise.all(students.map(async (student) => {
  
      const results = await QuizResult.find({ student: student._id });
      const avgQuiz = results.length > 0
        ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1)
        : 0;

      const totalLecturesCount = await Lecture.countDocuments({ 
        course: { $in: student.enrolledCourses },
        mentor: mentorId 
      });

    
      const validCompletedIds = (student.completedLectures || []).filter(id => id !== null);

      
      const completedLecturesCount = await Lecture.countDocuments({
        _id: { $in: validCompletedIds },
        mentor: mentorId
      });

    

      const progress = totalLecturesCount > 0
        ? Math.round((completedLecturesCount / totalLecturesCount) * 100)
        : 0;

      return {
        id: student._id,
        name: student.name,
        email: student.email,
        progress: progress,
        avgQuiz: avgQuiz,
        attendance: student.attendance || 0
      };
    }));

    res.status(200).json({ success: true, data: performanceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMentorProfile = async (req, res) => {
  try {
   
    const mentor = await User.findById(req.user._id)
      .populate({
    path: "enrolledBatches",
    populate: [
      { path: "course", select: "title" },
      { path: "students", select: "name email" }
    ]
  });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    res.status(200).json({
      success: true,
      data: mentor 
    });
  }catch(error){
    res.status(500).json({success:false , message: error.message})
  }
}

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course, deadline } = req.body;
    const mentorId = req.user._id;

    const newAssignment = new Assignment({
      title,
      description,
      course,
      mentor: mentorId,
      deadline,
      image: req.file ? `/uploads/${req.file.filename}` : "" 
    });

    await newAssignment.save();

   
    const students = await User.find({ enrolledCourses: course });

    
    const notificationPromises = students.map(async (student) => {
    
      await Notification.create({
        student: student._id,
        title: "New Assignment 📝",
        message: `New Assignment: ${title}. Deadline: ${new Date(deadline).toLocaleDateString("en-GB")}`,
        type: "assignment"
      });

     
      try {
        await sendEmail({
          to: student.email,
          subject: `New Assignment: ${title}`,
          text: `Hi ${student.name},\n\nA new assignment has been posted: ${title}.\nPlease check your portal for details.\n\nDeadline: ${deadline}`
        });
      } catch (mailErr) {
        console.error("Email failed for:", student.email);
      }
    });

  
    Promise.all(notificationPromises);


    res.status(201).json({ 
      success: true, 
      message: "Assignment created and students notified!", 
      data: newAssignment 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLiveLecture = async (req, res) => {
  try {
    const { title, date, startTime, duration } = req.body;
    
    const fullISOString = `${date.split('T')[0]}T${startTime}:00Z`;

    const zoomData = await zoomService.createMeeting(title, fullISOString, duration);

    const newLecture = await Lecture.create({
      ...req.body,
      meetingLink: zoomData.join_url, 
      zoomDetails: zoomData,
      mentor: req.user._id
    });

    const students = await User.find({ enrolledCourses: course });
    
    students.forEach(async (student) => {
      await Notification.create({
        student: student._id,
        title: "Upcoming Live Class! 🎥",
        message: `Live class "${title}" scheduled for ${new Date(date).toLocaleDateString()} at ${startTime}`,
        type: "live"
      });

      // 2. Instant Email
      await sendEmail({
        to: student.email,
        subject: `Live Class Scheduled: ${title}`,
        text: `Hi ${student.name}, a new live session has been scheduled.\n\nTopic: ${title}\nTime: ${startTime}\nDate: ${date}`
      });
    });

    res.status(201).json({ success: true, lecture: newLecture });
  } catch (error) {
    res.status(500).json({ message: error.message });}}

exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const mentorId = req.user._id;
   
    const assignments = await Assignment.find({ mentor: mentorId })
      .populate("course", "title")
      .populate("submissions.student", "name email");

    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.evaluateSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId, grade, feedback } = req.body;

    const updatedAssignment = await Assignment.updateOne(
      { _id: assignmentId, "submissions.student": studentId },
      {
        $set: {
          "submissions.$.grade": grade,
          "submissions.$.feedback": feedback
        }
      }
    );

    res.status(200).json({ success: true, message: "Assignment evaluated successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, course, deadline } = req.body;

    let updateData = { title, description, course, deadline };

   
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Assignment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Assignment updated!", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Assignment deleted permanently!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMentorCourses = async (req, res) => {
  try {
    const mentorId = req.user._id;

  
    const mentor = await User.findById(mentorId).populate({
      path: "enrolledBatches",
      populate: { path: "course" } 
    });

    if (!mentor || !mentor.enrolledBatches) {
      return res.status(200).json({ success: true, courses: [] });
    }

    
    const coursesMap = new Map();

    for (const batch of mentor.enrolledBatches) {
      if (batch.course) {
        const courseIdStr = batch.course._id.toString();
        
        if (!coursesMap.has(courseIdStr)) {
          
          const courseData = batch.course.toObject();

          const studentCount = await User.countDocuments({ 
            role: "student", 
            enrolledCourses: batch.course._id 
          });

          courseData.studentCount = studentCount; 
          coursesMap.set(courseIdStr, courseData);
        }
      }
    }
    
    const uniqueCourses = Array.from(coursesMap.values());

    res.status(200).json({
      success: true,
      count: uniqueCourses.length,
      courses: uniqueCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message
    });
  }
};