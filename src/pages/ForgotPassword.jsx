import { useState } from "react";
import toast from "react-hot-toast";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }

    console.log("Request OTP for:", email);
    toast.success("OTP sent to your email!");
    navigate("/verify-otp");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-md">
            <EnvelopeIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-500 text-sm">Enter your email to receive OTP</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && !email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && !email && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
}
