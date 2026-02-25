import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Phone, Briefcase, FileText, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { sendOtp } from "../../../services/authService";

const MentorProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    mobile: user.mobile || "",
    specialization: user.specialization || "",
    bio: user.bio || ""
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (formData.mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/admin/faculties/complete-setup", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        const updatedUser = { 
          ...user, 
          ...formData,
          isFirstLogin: false 
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setStep(2); 
      }
    } catch (err) {
      console.error("Mentor Update Error:", err);
      alert(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPasswordReset = async () => {
    setLoading(true);
    try {
      await sendOtp(user.email); 
      alert("OTP has been sent to your registered email.");
      navigate("/verify-otp", { state: { email: user.email, role: "mentor" } });
    } catch (err) {
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

            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <User className="text-[#059669]" size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Faculty Setup</h2>
                <p className="text-slate-500 font-medium">Complete your professional profile to proceed</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      placeholder="Enter 10 digit number"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#059669] outline-none transition-all font-medium"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="e.g. MERN Stack Expert"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#059669] outline-none transition-all font-medium"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">Short Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                    <textarea
                      placeholder="Briefly describe your experience..."
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#059669] outline-none transition-all font-medium h-28 resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2 ${
                    loading ? "bg-slate-400" : "bg-[#059669] hover:bg-[#047857]"
                  }`}
                >
                  {loading ? "Processing..." : "Complete Setup"}
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
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Profile Ready!</h2>
                <p className="text-slate-500 font-medium px-4">
                  Welcome to the team! For account security, would you like to update your default password?
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
                  onClick={() => navigate("/mentor/dashboard")}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;