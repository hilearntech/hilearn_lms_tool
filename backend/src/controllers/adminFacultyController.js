const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcryptjs");

/**
 * @desc    Get all faculties (mentors)
 * @route   GET /api/admin/faculties
 * @access  Private (Admin)
 *
 * Fetches all users whose role is set to "mentor"
 */
exports.getFaculties = async (req, res) => {
    // Find all users having role "mentor"
  const faculties = await User.find({ role: "mentor" });
  res.json(faculties);
};

/**
 * @desc    Add a new faculty
 * @route   POST /api/admin/faculties
 * @access  Private (Admin)
 *
 * Creates a new faculty account with role "mentor"
 * Password is securely hashed before saving
 */
exports.addFaculty = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Check if faculty already exists with same email
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Faculty already exists" });
  }

  // Hash the password before saving to database
  const hashed = await bcrypt.hash(password, 10);

  const faculty = await User.create({
    name,
    email,
    password: hashed,
    mobile,
    role: "mentor",
    isActive: true,
    isFirstLogin: true,
  });

  res.status(201).json(faculty);
};


exports.completeFacultyProfileSetup = async (req, res) => {
  try {
    const facultyId = req.user.id || req.user._id;
    const { password, mobile, specialization, bio } = req.body;

    const updateData = {
      mobile,
      specialization, 
      bio,
      isFirstLogin: false 
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      facultyId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update faculty details
 * @route   PUT /api/admin/faculties/:id
 * @access  Private (Admin)
 *
 * Updates faculty information based on faculty ID
 */
exports.updateFaculty = async (req, res) => {
     // Find faculty by ID and update provided fields
  const faculty = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(faculty);
};

/**
 * @desc    Delete a faculty
 * @route   DELETE /api/admin/faculties/:id
 * @access  Private (Admin)
 *
 * Permanently removes faculty from database
 */
exports.deleteFaculty = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Faculty deleted" });
};

/**
 * @desc    Assign faculty to a course
 * @route   POST /api/admin/faculties/assign-course
 * @access  Private (Admin)
 *
 * Assigns a faculty (mentor) to a specific course
 */
exports.assignFacultyToCourse = async (req, res) => {
  const { facultyId, courseId } = req.body;

  const course = await Course.findById(courseId);
  course.faculty = facultyId;
  await course.save();

  res.json({ message: "Faculty assigned to course" });
};

/**
 * @desc    Toggle faculty active/inactive status
 * @route   PATCH /api/admin/faculties/:id/toggle-status
 * @access  Private (Admin)
 *
 * Enables or disables faculty account by toggling isActive flag
 */
exports.toggleFacultyStatus = async (req, res) => {
  const faculty = await User.findById(req.params.id);

  faculty.isActive = !faculty.isActive;
  await faculty.save();

  res.json({ message: "Status updated", isActive: faculty.isActive });
};