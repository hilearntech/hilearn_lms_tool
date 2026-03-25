import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useScrollFix } from "../../services/useScrollFix";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import {
  GraduationCap,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

const Login = () => {
  useScrollFix();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(data);

      // Logical Check: Account Deactivation
      if (res.user && res.user.isActive === false) {
        alert("Your account is deactivated. Contact Admin.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Role Based Redirection Logic
      const role = res.user.role;
      if (role === "student") window.location.href = "/student";
      else if (role === "mentor") window.location.href = "/mentor";
      else if (role === "admin") window.location.href = "/admin";
      else if (role === "superadmin") {
        window.location.href = "/superadmin";
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => { window.location.href = "https://hilearnlmstool-production.up.railway.app/api/auth/google"; };
  const handleGithubLogin = () => { window.location.href = "https://hilearnlmstool-production.up.railway.app/api/auth/github"; };
  const handleFacebookLogin = () => { window.location.href = "https://hilearnlmstool-production.up.railway.app/api/auth/facebook"; };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* LEFT SECTION - UI Branding (From Upper Code) */}
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
                Welcome Back to <br /> Your Learning Journey
              </h2>
              <p className="text-lg text-emerald-100">
                Sign in to access your courses, track progress, and continue building your skills.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Personalized Dashboard</h3>
                  <p className="text-sm text-emerald-100">Track your courses, assignments, and achievements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Live & Recorded Classes</h3>
                  <p className="text-sm text-emerald-100">Access all your learning materials anytime</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-500 pt-6">
            <p className="text-emerald-100 italic">
              "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence."
            </p>
            <p className="text-sm mt-2 font-semibold">— Abigail Adams</p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Merged UI and Logic */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all font-medium text-gray-700"
            >
              <FaGoogle className="text-red-500 text-lg" />
              Continue with Google
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleGithubLogin} className="flex items-center justify-center gap-2 border-2 border-gray-300 py-3 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all font-medium text-gray-700">
                <FaGithub className="text-lg" /> GitHub
              </button>
              <button onClick={handleFacebookLogin} className="flex items-center justify-center gap-2 border-2 border-gray-300 py-3 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all font-medium text-gray-700">
                <FaFacebook className="text-blue-600 text-lg" /> Facebook
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Form with your logic */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-emerald-600 font-semibold hover:text-emerald-700">Create Account</a>
          </p>
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;