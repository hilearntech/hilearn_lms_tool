const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  getAllQuizzes, 
  getQuizzesByCourse, 
  submitQuiz 
} = require("../controllers/quizController");

// 1. Add New Quiz (Mentor/Admin)
router.post("/add", protect, createQuiz);

// 2. Update Quiz 
router.put("/update/:id", protect, updateQuiz);

// 3. Delete Quiz
router.delete("/delete/:id", protect, deleteQuiz);

// 4. Get Quizzes 
router.get("/all", protect, getAllQuizzes);

// 5. Get Quizzes by Course ID 
router.get("/course/:courseId", protect, getQuizzesByCourse);

// 6. Submit Quiz 
router.post("/submit", protect, submitQuiz);

module.exports = router;