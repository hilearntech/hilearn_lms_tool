const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, default: 5 },
  image: { type: String, default: "https://randomuser.me/api/portraits/men/1.jpg" },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Testimonial', testimonialSchema);