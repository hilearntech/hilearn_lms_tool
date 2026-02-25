const Lecture = require("../models/Lecture");
const User = require("../models/User"); 
const Notification = require("../models/Notification"); 
const sendEmail = require("../utils/sendEmail");


exports.createLecture = async (req, res) => {
  try {
    const lecture = await Lecture.create(req.body);

    const enrolledStudents = await User.find({ enrolledCourses: req.body.course });

   
    if (enrolledStudents.length > 0) {
      const notificationPromises = enrolledStudents.map(async (student) => {
        
        
        await Notification.create({
          student: student._id,
          title: "New Lecture Uploaded! 📚",
          message: `A new lecture "${lecture.title}" has been added to your course.`,
          type: "lecture"
        });

       
        try {
          await sendEmail({
            to: student.email,
            subject: `New Content: ${lecture.title}`,
            text: `Hi ${student.name},\n\nA new lecture has been uploaded: ${lecture.title}.\nLogin to your dashboard to watch it now!`
          });
        } catch (mailErr) {
          console.error(`Email fail ho gaya ${student.email} ke liye:`, mailErr.message);
        }
      });

      
      Promise.all(notificationPromises);
    }

    res.status(201).json({ success: true, lecture });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getLectures = async (req, res) => {
  try {
    let query = {};

   
    if (req.user && req.user.role === "student") {
      if (req.user.enrolledCourses && req.user.enrolledCourses.length > 0) {
        
        const courseIds = req.user.enrolledCourses.map(c => c._id);
        query = { course: { $in: courseIds } };
      } else {
       
        return res.json({ success: true, count: 0, lectures: [] });
      }
    }

    const lectures = await Lecture.find(query).sort({ createdAt: -1 }).populate("course");
    
    res.json({ 
      success: true, 
      count: lectures.length,
      lectures: lectures 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });
    res.json({ success: true, lecture });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);
    if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });
    res.json({ success: true, message: "Lecture deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};