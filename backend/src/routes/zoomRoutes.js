const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const zoomService = require('../servic/zoomService');
const Lecture = require('../models/Lecture');
const zoomController = require('../controllers/zoomController');

router.post('/signature', zoomController.generateSignature);
router.post('/start-meeting/:lectureId', async (req, res) => {
  try {
    const { lectureId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(lectureId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Lecture ID format" 
            });
        }

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).send("Lecture not found");
    

    if (!lecture) return res.status(404).json({ message: "Lecture not found" });

  
    if (lecture.meetingLink && lecture.zoomDetails?.start_url) {
       return res.json({ start_url: lecture.zoomDetails.start_url });
    }

    
    const datePart = new Date(lecture.date).toISOString().split('T')[0];
    const timePart = lecture.startTime.toLowerCase().replace('am', '').replace('pm', '').trim();
    const startTimeISO = `${datePart}T${timePart}:00Z`;

  
    const zoomData = await zoomService.createMeeting(
      lecture.title, 
      startTimeISO, 
      lecture.duration || 60
    );

    
    lecture.meetingLink = zoomData.join_url; 
    lecture.zoomDetails = zoomData; 
    await lecture.save();

    res.json({ start_url: zoomData.start_url });
  } catch (error) {
    console.error("Zoom Route Error:", error);
    res.status(500).json({ message: error.message || "Zoom meeting creation failed" });
  }
});

module.exports = router;