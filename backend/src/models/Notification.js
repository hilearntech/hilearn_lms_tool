const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["assignment", "live", "lecture", "certificate", "general"],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, 
    },
  },
  { timestamps: true } 
);


notificationSchema.index({ student: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);