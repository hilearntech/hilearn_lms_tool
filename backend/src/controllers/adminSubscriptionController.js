const SubscriptionPlan = require("../models/SubscriptionPlan");

/**
 * @desc    Get all subscription plans (Admin)
 * @route   GET /api/admin/subscriptions
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

/**
 * @desc    Create new subscription plan
 * @route   POST /api/admin/subscriptions
 */
exports.createPlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan" });
  }
};

/**
 * @desc    Update subscription plan
 * @route   PUT /api/admin/subscriptions/:id
 */
exports.updatePlan = async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ success: true, plan });
};

/**
 * @desc    Toggle plan status
 * @route   PATCH /api/admin/subscriptions/:id/status
 */
exports.togglePlanStatus = async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);
  plan.isActive = !plan.isActive;
  await plan.save();

  res.json({ success: true, isActive: plan.isActive });
};

/**
 * @desc    Delete subscription plan
 * @route   DELETE /api/admin/subscriptions/:id
 */
exports.deletePlan = async (req, res) => {
  await SubscriptionPlan.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Plan deleted" });
};
