const SubscriptionPlan = require("../models/SubscriptionPlan");

/**
 * @desc    Get all active subscription plans
 * @route   GET /api/subscriptions
 * @access  Public
 */
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};
