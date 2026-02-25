const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);


      req.user = await User.findById(decoded.id || decoded._id)
        .select("-password")
        .populate("enrolledCourses");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }



      next();
    } catch (error) {

      console.error("Auth Error:", error.message);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token, authorization denied" });
  }
};
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role}) is not authorized to access this route`,
      });
    }
    next();
  };
};

exports.login = async (req, res) => {

  const user = await User.findById(existingUser._id).populate("enrolledCourses");

  res.status(200).json({
    success: true,
    token,
    user
  });
};