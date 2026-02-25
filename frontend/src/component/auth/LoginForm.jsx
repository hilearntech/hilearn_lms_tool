import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await loginUser(data);

      
      if (res.role === "student") {
        navigate("/student/dashboard");
      } else if (res.role === "mentor") {
        navigate("/mentor/dashboard");
      } else if (res.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-800 mb-1">
        Welcome Back
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Login to continue learning
      </p>

      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Email address"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <Button text="Login" />
      </form>

      <div className="flex justify-between text-sm mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot password?
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;