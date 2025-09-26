import React from "react";

export default function ReportTabs({ tab, setTab }) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        className={`px-3 py-1 rounded ${tab === "attendance" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        onClick={() => setTab("attendance")}
      >
        Attendance
      </button>
      <button
        className={`px-3 py-1 rounded ${tab === "leaves" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
        onClick={() => setTab("leaves")}
      >
        Leaves
      </button>
    </div>
  );
}
