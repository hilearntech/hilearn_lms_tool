const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
   mentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
    students: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Batch", batchSchema);
