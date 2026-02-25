const mongoose = require("mongoose");

/**
 * Subscription Plan Schema
 */
const subscriptionPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    durationInDays: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
