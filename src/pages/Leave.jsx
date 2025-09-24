import { useState, useMemo } from "react";
import {
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const LEAVE_TYPES = [
  { value: "Paid", label: "Paid Leave" },
  { value: "Sick", label: "Sick Leave" },
  { value: "Casual", label: "Casual Leave" },
  { value: "Emergency", label: "Emergency Leave" },
  { value: "Unpaid", label: "Unpaid Leave" },
];

function statusClass(status) {
  if (status === "Approved") return "text-green-700 bg-green-100";
  if (status === "Rejected") return "text-red-700 bg-red-100";
  if (status === "Pending") return "text-yellow-700 bg-yellow-100";
  return "text-gray-600 bg-gray-100";
}

export default function LeaveDashboard() {
  const [paidLeavesAvailable, setPaidLeavesAvailable] = useState(3);
  const [isInProbation] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ type: "", from: "", to: "", reason: "" });
  const [errors, setErrors] = useState({});

  const [leaves, setLeaves] = useState([
    {
      id: 1,
      type: "Paid",
      from: "2025-09-10",
      to: "2025-09-10",
      days: 1,
      reason: "Personal",
      status: "Approved",
      appliedAt: "2025-09-01",
    },
    {
      id: 2,
      type: "Sick",
      from: "2025-09-20",
      to: "2025-09-21",
      days: 2,
      reason: "Fever",
      status: "Pending",
      appliedAt: "2025-09-18",
    },
  ]);

  const resetForm = () => setForm({ type: "", from: "", to: "", reason: "" });

  const calcDaysInclusive = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 0;
    const from = new Date(fromStr);
    const to = new Date(toStr);
    return Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
  };

  const validate = () => {
    let err = {};
    if (!form.type) err.type = "Select leave type";
    if (!form.from) err.from = "From date required";
    if (!form.to) err.to = "To date required";
    if (form.from && form.to && calcDaysInclusive(form.from, form.to) <= 0) {
      err.to = "To date must be same or after From date";
    }
    if (!form.reason || form.reason.trim().length < 3)
      err.reason = "Reason is required (min 3 chars)";
    if (isInProbation) err.probation = "Leave not allowed during probation";
    if (form.type === "Paid") {
      const days = calcDaysInclusive(form.from, form.to);
      if (days > paidLeavesAvailable)
        err.paid = `Not enough paid leaves (${paidLeavesAvailable} left)`;
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix errors");

    const days = calcDaysInclusive(form.from, form.to);
    const newLeave = {
      id: leaves.length + 1,
      type: form.type,
      from: form.from,
      to: form.to,
      days,
      reason: form.reason.trim(),
      status: "Pending",
      appliedAt: new Date().toISOString().split("T")[0],
    };

    setLeaves([newLeave, ...leaves]);
    toast.success("Leave request submitted");
    resetForm();
    setIsModalOpen(false);
  };

  const totalPending = useMemo(
    () => leaves.filter((l) => l.status === "Pending").length,
    [leaves]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leave Dashboard</h1>
        <p className="text-gray-500 text-sm">Apply for leaves and track your requests</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <p className="text-sm text-gray-500">Paid Leaves Left</p>
          <p className="text-3xl font-bold text-green-600">{paidLeavesAvailable}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow hover:from-indigo-700 hover:to-blue-700 transition"
          >
            <PlusIcon className="w-5 h-5" /> Apply Leave
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-600">{totalPending}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Policy</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 1 paid leave credited per month</li>
            <li>• No leaves during probation</li>
          </ul>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave History</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">From</th>
                <th className="py-3 px-4 text-left">To</th>
                <th className="py-3 px-4 text-left">Days</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Applied</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => (
                <tr
                  key={l.id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="py-3 px-4">{l.type}</td>
                  <td className="py-3 px-4">{l.from}</td>
                  <td className="py-3 px-4">{l.to}</td>
                  <td className="py-3 px-4">{l.days}</td>
                  <td className="py-3 px-4 truncate max-w-[180px]" title={l.reason}>
                    {l.reason}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{l.appliedAt}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusClass(
                        l.status
                      )}`}
                    >
                      {l.status === "Pending" && (
                        <ExclamationCircleIcon className="w-4 h-4" />
                      )}
                      {l.status === "Approved" && (
                        <CheckCircleIcon className="w-4 h-4" />
                      )}
                      {l.status === "Rejected" && (
                        <XMarkIcon className="w-4 h-4" />
                      )}
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    No leave requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn scale-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Apply for Leave</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.type
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-indigo-200"
                  }`}
                >
                  <option value="">Select type</option>
                  {LEAVE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
                {errors.paid && (
                  <p className="text-red-500 text-xs mt-1">{errors.paid}</p>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.from
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-indigo-200"
                    }`}
                  />
                  {errors.from && (
                    <p className="text-red-500 text-xs mt-1">{errors.from}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.to
                        ? "border-red-400 focus:ring-red-200"
                        : "border-gray-200 focus:ring-indigo-200"
                    }`}
                  />
                  {errors.to && (
                    <p className="text-red-500 text-xs mt-1">{errors.to}</p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  rows="3"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.reason
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-indigo-200"
                  }`}
                  placeholder="Short reason for leave"
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>

              {errors.probation && (
                <p className="text-red-600 text-sm">{errors.probation}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
