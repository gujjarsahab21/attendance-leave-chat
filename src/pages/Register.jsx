import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  LockClosedIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (validate()) {
      console.log("Register data:", formData);
      toast.success("Registration submitted! Verify your email.", {
        duration: 4000,
      });

      // ✅ Redirect to verify-email page
      navigate("/verify-email");

      // clear state (optional since we're navigating away)
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        password: "",
      });
      setErrors({});
      setSubmitted(false);
    } else {
      toast.error("All fields are required");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 flex flex-col">
        <div className="flex flex-col items-center mb-1">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-md">
            <UserPlusIcon className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">Request access to the portal</p>
        </div>

        <form className="space-y-5 flex-1" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && errors.phone
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Department
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Engineering, HR, Sales..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && errors.department
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Role
            </label>
            <div className="relative">
              <BriefcaseIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 appearance-none transition ${
                  submitted && errors.role
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {submitted && errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  submitted && errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {submitted && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
