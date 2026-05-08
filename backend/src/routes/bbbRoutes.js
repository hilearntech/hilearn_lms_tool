const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bbbService = require('../servic/bbbService');
const Lecture = require('../models/Lecture');

// POST /api/bbb/create-meeting/:lectureId
// Creates a BBB meeting for the given lecture (used by mentor/admin)
router.post('/create-meeting/:lectureId', async (req, res) => {
  try {
    const { lectureId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lecture ID format"
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // If meeting already exists, return existing moderator URL
    if (lecture.bbbMeetingID && lecture.bbbDetails?.moderator_url) {
      // Regenerate fresh join URLs (BBB URLs contain checksums that may expire)
      const moderator_url = bbbService.getJoinUrl(
        lecture.bbbMeetingID,
        'Moderator',
        lecture.bbbDetails.moderatorPW
      );
      return res.json({ moderator_url, join_url: lecture.meetingLink });
    }

    // Create new BBB meeting
    const meetingID = `hilearn-${lectureId}-${Date.now()}`;
    const bbbData = await bbbService.createMeeting(
      meetingID,
      lecture.title
    );

    // Save to lecture
    lecture.meetingLink = bbbData.join_url;
    lecture.bbbMeetingID = bbbData.meetingID;
    lecture.bbbDetails = {
      meetingID: bbbData.meetingID,
      moderatorPW: bbbData.moderatorPW,
      attendeePW: bbbData.attendeePW,
      moderator_url: bbbData.moderator_url,
      join_url: bbbData.join_url,
    };
    await lecture.save();
    console.log(`[BBB-CREATE] ✅ Saved lecture "${lecture.title}" with bbbMeetingID: ${lecture.bbbMeetingID}`);
    console.log(`[BBB-CREATE]    meetingLink: ${lecture.meetingLink}`);
    console.log(`[BBB-CREATE]    isEnded: ${lecture.isEnded}`);

    res.json({ moderator_url: bbbData.moderator_url, join_url: bbbData.join_url });
  } catch (error) {
    console.error("❌ BBB Route Error:", error.message);
    console.error("   BBB_URL:", process.env.BBB_URL || "(NOT SET)");
    console.error("   BBB_SECRET:", process.env.BBB_SECRET ? "SET (" + process.env.BBB_SECRET.length + " chars)" : "(NOT SET)");
    res.status(500).json({ message: error.message || "BBB meeting creation failed" });
  }
});

// GET /api/bbb/join/:lectureId
// Returns the appropriate join URL based on user role
router.get('/join/:lectureId', async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { role, name } = req.query;

    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lecture ID format"
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (!lecture.bbbMeetingID || !lecture.bbbDetails) {
      return res.status(400).json({ message: "No BBB meeting has been created for this lecture yet" });
    }

    const isModerator = role === 'mentor' || role === 'admin' || role === 'superadmin';
    const password = isModerator ? lecture.bbbDetails.moderatorPW : lecture.bbbDetails.attendeePW;
    const displayName = name || (isModerator ? 'Moderator' : 'Student');

    const joinUrl = bbbService.getJoinUrl(lecture.bbbMeetingID, displayName, password);

    res.json({ success: true, join_url: joinUrl });
  } catch (error) {
    console.error("BBB Join Error:", error);
    res.status(500).json({ message: error.message || "Failed to generate join URL" });
  }
});

module.exports = router;
