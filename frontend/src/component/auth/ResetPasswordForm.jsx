import { useParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import Input from "../common/Input";
import Button from "../common/Button";

const ResetPasswordForm = () => {
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(token, e.target.password.value);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="password" name="password" placeholder="New Password" />
        <Button text="Update Password" />
      </form>
    </div>
  );
};

export default ResetPasswordForm;