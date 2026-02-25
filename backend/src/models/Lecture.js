const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", required: true
    },
    duration: {
        type: String,
        default: "0"
    },

    date: {
        type: Date
    },
    startTime: {
        type: String
    },
    meetingLink: {
        type: String,
        default: ""
    },
    zoomDetails: {
        start_url: { type: String },
        meeting_id: { type: String },
        password: { type: String }
    },
    videoID:
    {
        type: String,
        default: ""
    },
    libraryID:
    {
        type: String,
        default: "592909"
    },

    videoUrl: {
        type: String,
        default: ""
    },
    lectureType: {
        type: String,
        enum: ["video", "live", "article", "quiz"],
        default: "video"
    },
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material"
    }],
    isPreviewFree: {
        type: Boolean,
        default: false
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Lecture", lectureSchema);