const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String },
    message: { type: String, required: true },
    rating: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["new", "contacted", "closed"], 
      default: "new" 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);