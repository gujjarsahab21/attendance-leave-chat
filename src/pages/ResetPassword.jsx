import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    let newErrors = {};
    if (!password) newErrors.password = "Password is required";
    if (!confirm) newErrors.confirm = "Confirm password is required";
    if (password && confirm && password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Password reset successfully:", password);
      toast.success("Password reset successful!");
      navigate("/login");
    } else {
      toast.error("Please fix the errors");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-md">
            <LockClosedIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-500 text-sm">Enter and confirm your new password</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                submitted && error.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {submitted && error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                submitted && error.confirm
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {submitted && error.confirm && (
              <p className="text-red-500 text-xs mt-1">{error.confirm}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
