import { useState } from "react";
import { sendOtp } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  ArrowRight,
  CheckCircle2,
  ChevronLeft
} from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendOtp(email);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">


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
                Secure Your <br /> Account Access
              </h2>
              <p className="text-lg text-emerald-100">
                Don't worry! It happens to the best of us. Just enter your email and we'll help you reset your password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Secure OTP Verification</h3>
                  <p className="text-sm text-emerald-100">Verified through your registered email address</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Instant Recovery</h3>
                  <p className="text-sm text-emerald-100">Quick and easy password reset process</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-500 pt-6">
            <p className="text-emerald-100 italic">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>
            <p className="text-sm mt-2 font-semibold">— B.B. King</p>
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email address to receive a verification code.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
            >
              {isLoading ? "Sending OTP..." : (
                <>
                  Send OTP Code
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              Need help? <a href="/contact" className="text-emerald-600 font-semibold hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;