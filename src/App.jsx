import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Holidays from "./pages/Holidays";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Layout from "./layout/Layout";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      

      {/* Protected Routes inside Layout */}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* Catch-all for 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
