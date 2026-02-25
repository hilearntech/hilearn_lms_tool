const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtpAndReset,
  completeSetup,
  getMe ,
  quickEnroll
} = require("../controllers/authController");

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/send-otp", sendOtp);
router.post("/quick-enroll", quickEnroll);
router.post("/verify-otp", verifyOtpAndReset);

router.put("/complete-setup", protect, completeSetup);
router.get("/me", protect, getMe); 

module.exports = router;