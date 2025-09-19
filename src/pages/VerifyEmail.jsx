import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EnvelopeOpenIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length === 6) {
      toast.success("Email Verified!");
      navigate("/pending-approval");
    } else {
      toast.error("Please enter full 6-digit OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        
        {/* Icon header */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-md">
            <EnvelopeOpenIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
          <p className="text-gray-500 text-sm">
            We’ve sent a confirmation code to your email.  
            Please enter the 6-digit OTP below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-12 h-12 text-center border rounded-lg shadow-sm text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Verify
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6">
          Didn’t get the code?{" "}
          <button
            type="button"
            onClick={() => toast.success("OTP resent!")}
            className="text-blue-600 font-medium hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}
