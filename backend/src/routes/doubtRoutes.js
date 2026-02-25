const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createDoubt, getMentorDoubts, resolveDoubt, getStudentDoubts, deleteDoubt } = require("../controllers/doubtController");
const { protect, authorize } = require("../middleware/authMiddleware"); // Aapka auth middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `doubt-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });


router.post("/create", protect, authorize("student"), upload.single("image"), createDoubt);
router.get("/my-doubts", protect, authorize("student"), getStudentDoubts);
router.get("/mentor-list", protect, authorize("mentor"), getMentorDoubts);
router.put("/resolve", protect, authorize("mentor"), upload.single("image"), resolveDoubt);
router.delete("/delete/:id", protect, authorize("student"), deleteDoubt);

module.exports = router;