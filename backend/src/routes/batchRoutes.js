const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  toggleBatchStatus,
  assignStudentsToBatch,
  getBatchById
} = require("../controllers/batchController");

router.get("/", protect, getBatches);
router.post("/", protect, createBatch);
router.put("/:id", protect, updateBatch);
router.delete("/:id", protect, deleteBatch);
router.post("/:id/status", protect, toggleBatchStatus);
router.post("/assign-students", protect, assignStudentsToBatch);
router.get("/:id", protect,getBatchById);

module.exports = router;
