import { useEffect, useState } from "react";
import { getSubscriptionPlans } from "../../services/subscriptionService";
import { createPaymentOrder, paymentSuccess } from "../../services/paymentService";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await getSubscriptionPlans();
      setPlans(res.data.plans);
    } catch (err) {
      alert("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };



const handleSubscribe = async (plan) => {
  try {
    
    const confirmPurchase = window.confirm(`Do you want to enroll in ${plan.title}?`);
    
    if (!confirmPurchase) return;

    
    const res = await paymentSuccess({
      courseId: plan._id, 
      paymentId: "DUMMY_MODE_" + Date.now(),
      amount: plan.price
    });

    if (res.data.success) {
      alert(`Success! You are now enrolled in ${plan.title}.`);
     
    }
  } catch (err) {
    console.error("Flow Error:", err);
    alert("Error: Make sure you are logged in as a student.");
  }
};

  if (loading) return <p className="text-center">Loading plans...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Subscription
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>

            <p className="text-2xl font-bold mb-4">
              ₹{plan.price}
            </p>

            <button
              onClick={() => handleSubscribe(plan)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
