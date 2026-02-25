import api from "./api";

export const getAdminPlans = () => api.get("/admin/subscriptions");

export const createPlan = (data) =>
  api.post("/admin/subscriptions", data);

export const updatePlan = (id, data) =>
  api.put(`/admin/subscriptions/${id}`, data);

export const deletePlan = (id) =>
  api.delete(`/admin/subscriptions/${id}`);

export const togglePlanStatus = (id) =>
  api.patch(`/admin/subscriptions/${id}/status`);
