require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const cron = require("node-cron"); // 1. Cron import karein
const Notification = require("./src/models/Notification");
const Lecture = require("./src/models/Lecture");
const User = require("./src/models/User");

connectDB();

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

   
    const upcomingLectures = await Lecture.find({
      lectureType: "live",
      reminderSent: { $ne: true },
      date: { $exists: true }
    });

    for (const lecture of upcomingLectures) {
      
      const [hours, minutes] = lecture.startTime.split(":");
      const classTime = new Date(lecture.date);
      classTime.setHours(parseInt(hours), parseInt(minutes), 0);

      const diffInMinutes = Math.floor((classTime - now) / 60000);

      
      if (diffInMinutes > 0 && diffInMinutes <= 30) {
        
        const students = await User.find({ role: "student", status: "active" });
        
        const notifications = students.map(student => ({
          student: student._id,
          title: "🔴 Live Class starting soon!",
          message: `Your class "${lecture.title}" starts in ${diffInMinutes} minutes. Join now!`,
          type: "live",
          isRead: false
        }));

        await Notification.insertMany(notifications);
        
       
        lecture.reminderSent = true;
        await lecture.save();
        console.log(`Reminder sent for: ${lecture.title}`);
      }
    }

    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);
    const deleted = await Notification.deleteMany({
      isRead: true,
      updatedAt: { $lte: thirtyMinsAgo }
    });
    
    if(deleted.deletedCount > 0) console.log(`${deleted.deletedCount} notifications cleaned up.`);

  } catch (err) {
    console.error("Cron Job Error:", err);
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
