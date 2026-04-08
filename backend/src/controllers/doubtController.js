const Doubt = require("../models/Doubt");
const Batch = require("../models/Batch");
const fs = require("fs"); 
const path = require("path");


exports.createDoubt = async (req, res) => {
  try {
    const { question, courseId } = req.body;
    const studentId = req.user.id;

    let mentorId = null;
    let autoAnswer = null;
    
    // RAG - Auto answer doubt
    if (req.body.lectureId) {
      try {
        const res2 = await fetch('http://localhost:8000/auto-answer-doubt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-RAG-Key': 'rag-secret-key-change-in-prod' },
          body: JSON.stringify({ lecture_id: req.body.lectureId, doubt: question, student_name: 'Student' })
        });
        const data = await res2.json();
        autoAnswer = data.answer || null;
      } catch (e) { console.log('RAG error:', e.message); }
    }

    
    if (courseId) {
      const batch = await Batch.findOne({ courseId: courseId });
      mentorId = batch?.mentorId || batch?.mentor;
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    
    const newDoubt = await Doubt.create({
      studentId, answer: autoAnswer,
      mentorId: mentorId || null,
      courseId: courseId || null,
      question,
      image: imagePath,
    });

    res.status(201).json({ 
      success: true, 
      message: mentorId ? "Doubt sent to mentor!" : "Doubt submitted! (Waiting for mentor assignment)", 
      data: newDoubt 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMentorDoubts = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const doubts = await Doubt.find({
      $or: [
        { mentorId: mentorId },
        { mentorId: null } 
      ]
    })
    .populate("studentId", "name email")
    .populate("courseId", "title")
    .sort("-createdAt");

    res.json({ success: true, doubts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.resolveDoubt = async (req, res) => {
  try {
    const { doubtId, answer } = req.body;
    
    
    const answerImage = req.file ? `/uploads/${req.file.filename}` : null;

    const doubt = await Doubt.findByIdAndUpdate(
      doubtId,
      { 
        answer, 
        answerImage, 
        status: "resolved" 
      },
      { new: true }
    );
    
    if (!doubt) return res.status(404).json({ success: false, message: "Doubt not found" });

    res.json({ success: true, message: "Doubt resolved with image!", doubt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentDoubts = async (req, res) => {
  try {
    const studentId = req.user.id;
    const doubts = await Doubt.find({ studentId }).populate("courseId", "title").sort("-createdAt");
    res.json({ success: true, doubts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({ success: false, message: "Doubt nahi mila!" });
    }

    
    if (doubt.studentId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Aap apna hi doubt delete kar sakte hain!" });
    }

    
    const safeUnlink = (relativePath) => {
      try {
        if (relativePath) {
          const fullPath = path.join(__dirname, "..", relativePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      } catch (fileErr) {
        console.error("File delete nahi ho payi:", fileErr.message);
        
      }
    };

   
    safeUnlink(doubt.image);
    safeUnlink(doubt.answerImage);

   
    await Doubt.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Doubt successfully delete ho gaya!" });
  } catch (error) {
    console.error("Delete Controller Error:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};


