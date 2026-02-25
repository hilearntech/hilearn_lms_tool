const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 1. Password Match Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 2. IMPORTANT: Deactivation Check
    if (user.isActive === false) {
      return res.status(403).json({ 
        success: false, 
        message: "Your account is inactive. Please contact HiLearn Admin." 
      });
    }

    res.json({
      success: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isFirstLogin: user.isFirstLogin
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({ success: true, resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body; 

    
    const user = await User.findOne({ email });
    if (type === "forgot" && !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    if (user) {
      user.otp = otp;
      user.otpExpire = Date.now() + 5 * 60 * 1000;
      await user.save();
    }
    
   
    await sendEmail({
      to: email,
      subject: "Your Verification Code - HILEARN",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    });

    
    res.json({ success: true, message: "OTP sent to email", otp: otp }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeSetup = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.mobile = mobile;
    user.isFirstLogin = false; 
    await user.save();

    
    const { password, otp, ...userData } = user._doc;

    res.json({ 
      success: true, 
      message: "Basic details updated!",
      user: userData
    });
  } catch (error) {
    console.error("Error in completeSetup:", error); 
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });}}

exports.quickEnroll = async (req, res) => {
  try {
    const { name, email, password, courseId } = req.body;

    
    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "student",
        isActive: true,
        enrolledCourses: [courseId] 
      });
    } else {
     
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { enrolledCourses: courseId }
      });
    }

    
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Enrolled Successfully!",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};