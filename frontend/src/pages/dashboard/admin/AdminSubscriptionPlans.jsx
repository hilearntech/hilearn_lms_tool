import { useEffect, useState } from "react";
import {
  getAdminPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from "../../../services/adminSubscriptionService";

const AdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    durationInDays: "",
  });


  const loadPlans = async () => {
    const res = await getAdminPlans();
    setPlans(res.data.plans);
  };

  useEffect(() => {
    loadPlans();
  }, []);


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      price: "",
      durationInDays: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updatePlan(editId, form);
      } else {
        await createPlan(form);
      }
      resetForm();
      loadPlans();
    } catch (err) {
      alert("Failed to save plan");
    }
  };

  const handleEdit = (plan) => {
    setEditId(plan._id);
    setForm({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      durationInDays: plan.durationInDays,
    });
  };


  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ================= ADD / EDIT FORM ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* Title color changed to Emerald */}
        <h2 className="text-xl font-bold mb-4 text-[#059669]">
          {editId ? "Edit Plan" : "Add Subscription Plan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Plan Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-none focus:border-[#059669]"
            required
          />

          <textarea
            name="description"
            placeholder="Plan Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-none focus:border-[#059669]"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-none focus:border-[#059669]"
            required
          />

          <input
            name="durationInDays"
            type="number"
            placeholder="Duration (Days)"
            value={form.durationInDays}
            onChange={handleChange}
            className="w-full border p-3 rounded outline-none focus:border-[#059669]"
            required
          />

          <div className="flex gap-3">

            <button
              type="submit"
              className="flex-1 bg-[#059669] text-white py-3 rounded font-semibold hover:bg-[#047857] transition-colors"
            >
              {editId ? "Update Plan" : "Add Plan"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 border py-3 rounded font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>


      <div className="lg:col-span-2 bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-[#059669] text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="text-left">Price</th>
              <th className="text-left">Duration</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium">{plan.title}</td>
                <td>₹{plan.price}</td>
                <td>{plan.durationInDays} days</td>


                <td>
                  <button
                    onClick={() =>
                      togglePlanStatus(plan._id).then(loadPlans)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </button>
                </td>


                <td className="flex gap-3 justify-center py-3">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-[#059669] font-semibold hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      window.confirm("Delete this plan?") &&
                      deletePlan(plan._id).then(loadPlans)
                    }
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No subscription plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptionPlans;