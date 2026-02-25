const Quiz = require("../models/Quiz");
const QuizResult = require("../models/QuizResult");
const mongoose = require("mongoose");


exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions, duration } = req.body;
    const newQuiz = new Quiz({ title, course, questions, duration });
    await newQuiz.save();
    res.status(201).json({ success: true, message: "Quiz created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateQuiz = async (req, res) => {
  try {
    const { title, course, questions, duration } = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, course, questions, duration },
      { new: true }
    );
    if (!updatedQuiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.status(200).json({ success: true, message: "Quiz updated successfully!", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    res.status(200).json({ success: true, message: "Quiz deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getAllQuizzes = async (req, res) => {
  try {
    let query = {};

    
    if (req.user.role === "student") {
      if (req.user.enrolledCourses && req.user.enrolledCourses.length > 0) {
        const courseIds = req.user.enrolledCourses.map(course => course._id || course);
        query = { course: { $in: courseIds } };
      } else {
        return res.status(200).json({ success: true, quizzes: [] });
      }
    }

    
    const quizzes = await Quiz.find(query).populate("course").lean();

    
    if (req.user.role === "student") {
      const studentId = req.user._id;

      
      const attempts = await QuizResult.find({ student: studentId });

      const quizzesWithStatus = quizzes.map(quiz => {
       
        const attemptRecord = attempts.find(a => a.quiz.toString() === quiz._id.toString());

        return {
          ...quiz,
          isAttempted: !!attemptRecord, 
          userScore: attemptRecord ? attemptRecord.score : null 
        };
      });

      return res.status(200).json({ success: true, quizzes: quizzesWithStatus });
    }

    
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error in getAllQuizzes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId });
    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.submitQuiz = async (req, res) => {
  try {
    console.log("SUBMIT QUIZ CALLED!");
    const { quizId, answers, courseId } = req.body;
    const studentId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let correctCount = 0;
    const totalQue = quiz.questions.length;

    quiz.questions.forEach((q, index) => {
      const studentAns = answers.find(a => a.qIndex === index);
      if (studentAns && studentAns.selected === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / totalQue) * 100);

    const result = await QuizResult.create({
      student: studentId,
      quiz: quizId,
      course: courseId || quiz.course, 
      score: finalScore,
      totalQuestions: totalQue
    });

    console.log("Result Saved in DB:", result);
    res.status(200).json({ success: true, score: finalScore });

  } catch (error) {
    console.error("SUBMIT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};