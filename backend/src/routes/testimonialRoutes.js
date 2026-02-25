const router = require('express').Router();
const Testimonial = require('../models/Testimonial');
const { protect: verifyToken } = require('../middleware/authMiddleware');

// 1. Get All Testimonials (Public)
router.get('/', async (req, res) => {
    try {
        const data = await Testimonial.find().sort({ createdAt: -1 });
        res.json({ success: true, testimonials: data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. Add New Testimonial (Admin Only)
router.post('/', verifyToken, async (req, res) => {
    try {
        const newEntry = new Testimonial(req.body);
        await newEntry.save();
        res.json({ success: true, message: "Review Published!" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 3. Delete Testimonial (Admin Only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;