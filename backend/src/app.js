const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const cron = require("node-cron");
const Lecture = require("./models/Lecture");
const Notification = require("./models/Notification");
const sendEmail = require("./utils/sendEmail");

// Routes Import
const courseRoutes = require("./routes/courseRoutes");
const materialRoutes = require("./routes/materialRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const zoomRoutes = require('./routes/zoomRoutes');
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes");
const batchRoutes = require("./routes/batchRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const lectureRoutes = require("./routes/lectureRoutes.js");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const adminSubscriptionRoutes = require("./routes/adminSubscriptionRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminFacultyRoutes = require("./routes/adminFacultyRoutes");
const blogRoutes = require("./routes/blogRoutes");
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();

// CORS Configuration
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});
app.use('/api/zoom', zoomRoutes);

// --- Routes Section ---
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminFacultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/mentor", mentorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/batches", batchRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin/subscriptions", adminSubscriptionRoutes);
app.use("/api/blogs", blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use("/api/doubts", require("./routes/doubtRoutes"));
app.use("/uploads", express.static("uploads"));


const seedSuperAdmin = async () => {
  try {

    const adminExists = await User.findOne({ role: "superadmin" });


    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || "admin123", 10);
      await User.create({
        name: "Super Admin",
        email: process.env.SUPER_ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
        role: "superadmin",
        isActive: true
      });
      console.log("✅ Super Admin Account Created Successfully!");
    } else {
      console.log("ℹ️ Super Admin already exists, skipping seed.");
    }
  } catch (error) {
    console.error("❌ Super Admin Seeding Error:", error);
  }
};

const seedData = async () => {
  try {
    const Course = require("./models/Course");
    const count = await Course.countDocuments();
    if (count === 0) {
      const defaultCourses = [
        { title: "MERN Stack Web Development", description: "Master React, Node, Express and MongoDB.", price: "25000", duration: "6 Months", category: "programming" },
        // { title: "Graphic Designing", description: "Learn Photoshop, Illustrator and Canva.", price: "12000", duration: "3 Months", category: "Design" },
        // { title: "Digital Marketing", description: "SEO, Social Media and Ads masterclass.", price: "15000", duration: "4 Months", category: "Marketing" }
      ];
      await Course.insertMany(defaultCourses);
      console.log("✅ Default courses seeded!");
    }
  } catch (err) { console.error("Seeding error:", err); }
};

mongoose.connection.once("open", () => {
  seedData();
  seedSuperAdmin();
});

// --- AUTOMATION: LIVE CLASS REMINDERS (30 MINS BEFORE) ---
cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 25 * 60000);
    const windowEnd = new Date(now.getTime() + 35 * 60000);


    const upcomingLiveClasses = await Lecture.find({
      lectureType: "live",
      reminderSent: { $ne: true },
      date: { $gte: windowStart, $lte: windowEnd }
    });

    if (upcomingLiveClasses.length > 0) {
      for (let lecture of upcomingLiveClasses) {

        const enrolledStudents = await User.find({ enrolledCourses: lecture.course });

        for (let student of enrolledStudents) {

          await Notification.create({
            student: student._id,
            title: "Class Starting Soon! 🎥",
            message: `Your live class "${lecture.title}" starts in 30 minutes. Be ready!`,
            type: "live"
          });

          // B. Email Reminder
          try {
            await sendEmail({
              to: student.email,
              subject: "Reminder: Live Class in 30 Mins",
              text: `Hi ${student.name}, the class "${lecture.title}" is starting soon at ${lecture.startTime}. Join link: ${lecture.meetingLink}`
            });
          } catch (e) { console.log("Reminder Email Error:", e.message); }
        }

        // 3. Mark kar do ki reminder bhej diya gaya hai
        lecture.reminderSent = true;
        await lecture.save();
        console.log(`✅ Reminder sent for live class: ${lecture.title}`);
      }
    }
  } catch (err) {
    console.error("Cron Job Error:", err);
  }
});

module.exports = app;