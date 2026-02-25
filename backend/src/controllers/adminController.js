const User = require("../models/User");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const Lecture = require("../models/Lecture");
const Contact = require("../models/Contact"); 
const Assignment = require("../models/Assignment"); 
const bcrypt = require("bcryptjs");
const Announcement = require("../models/Announcement");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    Get all admins
 */
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching admins" });
  }
};

/**
 * @desc    Add a new admin
 */
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await User.create({
      name, email, mobile, password: hashedPassword, role: "admin", isActive: true
    });
    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating admin" });
  }
};

/**
 * @desc    Update admin details
 */
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/**
 * @desc    Delete an admin
 */
exports.deleteAdmin = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself!" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

/**
 * @desc    Toggle admin active/inactive status
 */
exports.toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    admin.isActive = !admin.isActive;
    await admin.save();
    res.status(200).json({ success: true, isActive: admin.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: "Toggle failed" });
  }
};

/**
 * @desc    Get Dashboard Stats (Updated with Dynamic Pending Count)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [studentCount, courses, batches, lectures, allAssignments] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments(),
      Batch.countDocuments(),
      Lecture.countDocuments(),
      Assignment.find() 
    ]);

    // Logic for Dynamic Pending Assignments count
    let pendingCount = 0;
    allAssignments.forEach(assign => {
      const pendingSub = assign.submissions.filter(s => s.grade === "Not Graded").length;
      pendingCount += pendingSub;
    });

    res.status(200).json({
      success: true,
      stats: { 
        students: studentCount, 
        courses, 
        batches, 
        lectures,
        pendingAssignments: pendingCount 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, admin: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;
    const newLead = await Contact.create({ name, email, phone, course, message });
    res.status(201).json({ success: true, message: "Aapki inquiry save ho gayi hai!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllContactLeads = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Permission denied." });
    }
    const leads = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.submitDemoRequest = async (req, res) => {
  try {
    const { name, email, phone, courseTitle } = req.body;

    const newRequest = await Contact.create({
      name,
      email,
      phone,
      course: courseTitle, 
      message: `Student requested a demo video for ${courseTitle}`, 
      status: "new",
      rating: 0
    });

    res.status(201).json({ 
      success: true, 
      message: "Request submitted successfully!", 
      data: newRequest ,
      contactId: newRequest._id
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update Demo Rating in Contact
 * @route   POST /api/admin/update-rating
 */
exports.updateRating = async (req, res) => {
  try {
    const { contactId, rating } = req.body;

    if (!contactId) {
      return res.status(400).json({ success: false, message: "Contact ID is required" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { $set: { rating: rating } },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Rating updated successfully!", 
      data: updatedContact 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a contact lead
 * @route   DELETE /api/admin/contact/delete/:id
 */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Contact.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const dummyTransactions = [
      { _id: "1", txnId: "TXN_9988", studentName: "Urvesh", courseName: "React Pro", amount: 5000, status: "Success" },
      { _id: "2", txnId: "TXN_9989", studentName: "Gopi", courseName: "Node.js Expert", amount: 3000, status: "Success" }
    ];
    res.status(200).json({ success: true, data: dummyTransactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllAssignmentsStatus = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("mentor", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching status" });
  }
};

/**
 * @desc    Delete Assignment by Admin
 * @route   DELETE /api/admin/delete-assignment/:id
 */
exports.deleteAssignmentByAdmin = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
    res.status(200).json({ success: true, message: "Assignment deleted successfully by Admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

/**
 * @desc    Update Assignment by Admin
 * @route   PUT /api/admin/update-assignment/:id
 */
exports.updateAssignmentByAdmin = async (req, res) => {
  try {
    const { title, description } = req.body;
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description } },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({ success: true, data: updatedAssignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 1. Create Announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and Description are required" });
        }

        const newAnnouncement = new Announcement({
            title,
            description,
            createdBy: req.user.name || "Admin", 
        });

        await newAnnouncement.save();
        res.status(201).json({ success: true, message: "Announcement published successfully! 🎉" });
    } catch (err) {
        console.error("Create Announcement Error:", err);
        res.status(500).json({ success: false, message: "Server error while creating announcement" });
    }
};

// 2. Get All Announcements (For Admin List)
exports.getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, announcements });
    } catch (err) {
        console.error("Fetch Announcements Error:", err);
        res.status(500).json({ success: false, message: "Server error while fetching announcements" });
    }
};

// 3. Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        res.status(200).json({ success: true, message: "Announcement deleted successfully!" });
    } catch (err) {
        console.error("Delete Announcement Error:", err);
        res.status(500).json({ success: false, message: "Server error while deleting" });
    }
};


/**
 * @desc    Issue/Upload Certificate to a Student
 * @route   POST /api/admin/issue-certificate
 */

exports.issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId, title, url } = req.body;

    if (!studentId || !courseId || !url) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    // Certificate data object
    const newCertificate = {
      courseId,
      title: title || "Course Completion Certificate",
      url, 
      issueDate: Date.now(),
      issuedBy: req.user.name
    };

    student.certificates.push(newCertificate);
    await student.save();

    await Notification.create({
      student: studentId,
      title: "🎓 Certificate Issued!",
      message: `Congratulations! Your certificate for "${newCertificate.title}" is now available in your profile.`,
      type: "certificate",
      isRead: false
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Success: Certificate issued and student notified." 
    });
  } catch (error) {
    console.error("Issue Certificate Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

/**
 * @desc    Fetch All Students (For Certificate Management)
 */
exports.getAllStudentsForCert = async (req, res) => {
  try {
    // Only fetch students
    const students = await User.find({ role: "student" })
      .select("name email enrolledCourses certificates")
      .populate("enrolledCourses", "title");
      
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching student data." });
  }
};

exports.getSuperAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "mentor" }); 
    const activeCourses = await Course.countDocuments();
    
    const totalRevenue = "₹5,40,000"; 

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalStudents,
        activeCourses,
        totalInstructors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};