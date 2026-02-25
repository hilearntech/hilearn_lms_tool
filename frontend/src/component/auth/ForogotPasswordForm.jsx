
import { forgotPassword } from "../../services/authService";
import Button from "../common/Button";
import Input from "../common/Input";

const ForgotPasswordForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(e.target.email.value);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" placeholder="Enter registered email" />
        <Button text="Send Reset Link" />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;