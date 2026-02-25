const express = require("express");
const { createLecture, getLectures, updateLecture, deleteLecture } = require("../controllers/lectureController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createLecture);
router.get("/", protect, getLectures); 
router.put("/:id", protect, updateLecture);
router.delete("/:id", protect, deleteLecture);

module.exports = router;