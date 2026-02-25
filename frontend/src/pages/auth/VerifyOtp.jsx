import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/authService";
import {
  GraduationCap,
  Lock,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtp({
        email: state?.email,
        otp,
        newPassword: password,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP or request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* LEFT SECTION - Branding (Consistent with Login/Forgot) */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="text-emerald-600 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HILEARN</h1>
              <p className="text-[10px] tracking-widest text-emerald-100 font-semibold">ACADEMY</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Last Step to <br /> Recovery
              </h2>
              <p className="text-lg text-emerald-100">
                Check your email for the verification code. Enter the OTP and your new password to regain access.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Two-Factor Security</h3>
                  <p className="text-sm text-emerald-100">Ensuring only you can reset your credentials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Encryption Protocol</h3>
                  <p className="text-sm text-emerald-100">Your new password is encrypted immediately</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-500 pt-6">
            <p className="text-emerald-100 italic">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <p className="text-sm mt-2 font-semibold">— Brian Herbert</p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - OTP & Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="mb-8 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify & Reset</h2>
            <p className="text-gray-600">OTP sent to: <span className="text-emerald-600 font-medium">{state?.email || "your email"}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">OTP Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all tracking-[0.2em] font-bold"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* New Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
            >
              {isLoading ? "Verifying..." : (
                <>
                  Reset Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Resend Email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
