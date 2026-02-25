import api from "./api";

/**
 * Fetch subscription plans
 */
export const getSubscriptionPlans = () => {
  return api.get("/subscriptions");
};
