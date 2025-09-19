//this flow is for forgotpassword and verifies OTP
import { useState, useRef } from "react";
import { KeyIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next field
    if (index < 5 && value) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    console.log("Entered OTP:", code);
    toast.success("OTP verified successfully!");
    navigate("/reset-password");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-md">
            <KeyIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-gray-500 text-sm">Enter the 6-digit OTP sent to your email</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-center border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}
