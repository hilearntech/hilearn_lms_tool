const Batch = require("../models/Batch");
const User = require("../models/User");

/**
 * Get all batches
 * @route GET /api/batches
 * @access Public / Protected (as per middleware)
 */

exports.getBatches = async (req, res) => {
  const batches = await Batch.find()
    .populate("course", "title")
    .populate("mentor", "name") 
    .populate("students", "name email");
  res.json({
    success: true,
    data: batches,
  });
};

/**
 * Create a new batch
 * @route POST /api/batches
 * @access Protected
 */

exports.createBatch = async (req, res) => {
  try {
    const { name, course, mentor } = req.body;
    const batch = await Batch.create({ name, course, mentor });

    if (mentor) {
      await User.findByIdAndUpdate(mentor, {
        $push: { enrolledBatches: batch._id } 
      });
    }

    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ message: "Failed to create batch" });
  }
};

/**
 * Update batch details
 * @route PUT /api/batches/:id
 * @access Protected
 */
exports.updateBatch = async (req, res) => {
  const { name, course } = req.body;

  const batch = await Batch.findByIdAndUpdate(
    req.params.id,
    { name, course },
    { new: true }
  );

  res.json({
    success: true,
    data: batch,
  });
};

/**
 * Delete a batch
 * @route DELETE /api/batches/:id
 * @access Protected
 */
exports.deleteBatch = async (req, res) => {
  await Batch.findByIdAndDelete(req.params.id);
  res.json({ message: "Batch deleted" });
};

/**
 * Toggle batch active/inactive status
 * @route PATCH /api/batches/:id/toggle-status
 * @access Protected
 */
exports.toggleBatchStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // SAFETY CHECK
    if (!id) {
      return res.status(400).json({ message: "Batch ID is required" });
    }

    const batch = await Batch.findById(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    batch.isActive = !batch.isActive;
    await batch.save();

    res.json({
      success: true,
      isActive: batch.isActive,
    });
  } catch (error) {
    console.error("Toggle Batch Error:", error);
    res.status(500).json({ message: "Failed to update batch status" });
  }
};



exports.assignStudentsToBatch = async (req, res) => {
  try {
    const { batchId, studentIds } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { students: { $each: studentIds } } },
      { new: true }
    );


    await User.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { enrolledBatches: batchId } }
    );

    res.json({ success: true, message: "Students and Users updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate("course", "title")
      .populate("mentor", "name email mobile")
      .populate("students", "name email mobile isActive"); 

    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json({ success: true, data: batch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
