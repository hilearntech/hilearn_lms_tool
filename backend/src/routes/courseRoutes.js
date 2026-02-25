const express = require("express");
const { createCourse, getCourses, getCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.post("/",  createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;