const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} = require("../controllers/adminSubscriptionController");

router.get("/", protect, getAllPlans);
router.post("/", protect,  createPlan);
router.put("/:id", protect,   updatePlan);
router.delete("/:id", protect,  deletePlan);
router.patch("/:id/status", protect,  togglePlanStatus);

module.exports = router;
