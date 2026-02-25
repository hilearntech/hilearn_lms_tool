const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getCourses = async (req, res) => {
  try {
    let rawCourses;
    if (req.user && req.user.role === "student" && req.originalUrl.includes('dashboard')) {
      rawCourses = req.user.enrolledCourses || [];
    } else {
      rawCourses = await Course.find({});
    }

    const formattedCourses = rawCourses.map(course => {
      if (!course) return null;
      const courseObj = typeof course.toObject === 'function' ? course.toObject() : course;
      
      return {
        ...courseObj,
        status: courseObj.status || "active",
        progress: courseObj.progress || 0,
        studentCount: courseObj.studentCount || "0",
        rating: courseObj.rating || 0,
        features: courseObj.features || [],
      };
    }).filter(c => c !== null);

    res.status(200).json({
      success: true,
      count: formattedCourses.length,
      courses: formattedCourses
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; 

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Enrolled successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};