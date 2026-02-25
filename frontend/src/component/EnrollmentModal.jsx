import { useState } from "react";
import { X, Mail, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";

const EnrollmentModal = ({ course, onClose, onEnrollSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", otp: "" });
  const [serverOtp, setServerOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email: formData.email,
        type: "signup"
      });

      if (data.success) {
        setServerOtp(data.otp);
        setStep(2);
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP bhejne mein dikat hui");
    } finally {
      setIsLoading(false);
    }
  };


  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (formData.otp === serverOtp) {
      setStep(3);
    } else {
      alert("Galat OTP hai bhai!");
    }
  };


  const handleFinalPayment = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/quick-enroll", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        courseId: course._id
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Badhai ho! Enrollment ho gaya.");
        onEnrollSuccess();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment fail ho gaya");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X /></button>

        <div className="p-8">
          {step === 1 && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              <button disabled={isLoading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">
                {isLoading ? "sending OTP..." : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
              <Mail className="mx-auto text-emerald-600 w-12 h-12" />
              <h2 className="text-2xl font-bold">Verify OTP</h2>
              <p className="text-gray-500 text-sm">Sent to {formData.email}</p>
              <input type="text" placeholder="6 Digit OTP" className="w-full text-center text-2xl p-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, otp: e.target.value })} />
              <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold">Verify OTP</button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 text-sm">Total Price</p>
                <h3 className="text-4xl font-extrabold text-gray-900 mt-2">₹{course.price}</h3>
              </div>
              <button onClick={handleFinalPayment} disabled={isLoading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                {isLoading ? "Processing..." : "Pay & Start Learning"} <ArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;