import api from "./api";

/**
 * Create payment order
 */
export const createPaymentOrder = (data) =>
  api.post("/payments/create-order", data);

/**
 * Payment success
 */
export const paymentSuccess = (data) =>
  api.post("/payments/success", data);
