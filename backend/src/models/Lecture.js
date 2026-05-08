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
    bbbMeetingID: {
        type: String,
        default: ""
    },
    bbbDetails: {
        meetingID: { type: String },
        moderatorPW: { type: String },
        attendeePW: { type: String },
        moderator_url: { type: String },
        join_url: { type: String }
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
    isEnded: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Lecture", lectureSchema);