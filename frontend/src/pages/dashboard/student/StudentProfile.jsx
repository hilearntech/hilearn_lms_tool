import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { completeProfileSetup } from "../../../services/adminService";
import { sendOtp } from "../../../services/authService";

const StudentProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const [step, setStep] = useState(1); 
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBasicUpdate = async (e) => {
    e.preventDefault();
    if (mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await completeProfileSetup({ mobile });
      
      if (res.data.success) {
        const updatedUser = { 
            ...user, 
            mobile: mobile, 
            isFirstLogin: false 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setStep(2); 
      }
    } catch (err) {
      console.error("Profile Update Error:", err);
      alert(err.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPasswordReset = async () => {
    setLoading(true);
    try {
      await sendOtp(user.email); 
      alert("OTP has been sent to your registered email.");
      navigate("/verify-otp", { state: { email: user.email } });
    } catch (err) {
      console.error("OTP Error:", err);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Decoration */}
        <div className="h-2 bg-[#059669]" />

        <div className="p-8">
          {step === 1 ? (
        
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <User className="text-[#059669]" size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Complete Profile</h2>
                <p className="text-slate-500 font-medium">Please provide your contact details to proceed</p>
              </div>

              <form onSubmit={handleBasicUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      placeholder="Enter 10 digit number"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all font-medium text-slate-800"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    loading ? "bg-slate-400" : "bg-[#059669] hover:bg-[#047857]"
                  }`}
                >
                  {loading ? "Processing..." : "Update Details"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            </div>
          ) : (
           
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="space-y-2">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-[#059669]" size={35} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Details Saved!</h2>
                <p className="text-slate-500 font-medium px-4">
                  For your account security, would you like to update your default password now?
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={handleGoToPasswordReset}
                  disabled={loading}
                  className="w-full bg-[#059669] hover:bg-[#047857] text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={19} />
                  {loading ? "Sending OTP..." : "Secure My Account"}
                </button>
                
                <button 
                  onClick={() => navigate("/student/dashboard")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;