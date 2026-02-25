import { useState } from "react";
import { registerUser } from "../../services/authService";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Briefcase
} from "lucide-react";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await registerUser(data);
      window.location.href = "/";
    } catch (error) {
      alert("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* LEFT SECTION - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <GraduationCap className="text-emerald-600 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HILEARN</h1>
              <p className="text-[10px] tracking-widest text-emerald-100 font-semibold">ACADEMY</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Start Your Learning
                <br />
                Journey Today
              </h2>
              <p className="text-lg text-emerald-100">
                Join thousands of students transforming their careers with industry-aligned education and expert mentorship.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Expert-Led Courses</h3>
                  <p className="text-sm text-emerald-100">Learn from IIT & IIM faculty with real-world experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Hands-On Projects</h3>
                  <p className="text-sm text-emerald-100">Build your portfolio with industry-standard projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Career Support</h3>
                  <p className="text-sm text-emerald-100">Get placement assistance and career guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="grid grid-cols-3 gap-6 border-t border-emerald-500 pt-6">
            <div>
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-sm text-emerald-100">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm text-emerald-100">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold">85%</div>
              <div className="text-sm text-emerald-100">Career Growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HILEARN</h1>
              <p className="text-[9px] tracking-widest text-emerald-600 font-semibold">ACADEMY</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Register to start your learning journey
            </p>
          </div>

          {/* Register Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
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
              <p className="mt-1.5 text-xs text-gray-500">
                Use 8 or more characters with a mix of letters and numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Register As
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  name="role"
                  value={data.role}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Sign In
            </a>
          </p>

          {/* Back to Home */}
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

export default RegisterPage;