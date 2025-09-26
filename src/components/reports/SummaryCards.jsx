import React from "react";

export default function SummaryCards({ tab, attendanceData, leaveData }) {
  if (tab === "attendance") {
    const present = attendanceData.filter((a) => a.status === "Present").length;
    const absent = attendanceData.filter((a) => a.status === "Absent").length;
    return (
      <div className="flex gap-4 mb-4">
        <div className="p-4 bg-white rounded shadow flex-1">
          <div>Present</div>
          <div className="text-xl font-bold">{present}</div>
        </div>
        <div className="p-4 bg-white rounded shadow flex-1">
          <div>Absent</div>
          <div className="text-xl font-bold">{absent}</div>
        </div>
      </div>
    );
  } else {
    const approved = leaveData.filter((l) => l.status === "Approved").length;
    const pending = leaveData.filter((l) => l.status === "Pending").length;
    return (
      <div className="flex gap-4 mb-4">
        <div className="p-4 bg-white rounded shadow flex-1">
          <div>Approved</div>
          <div className="text-xl font-bold">{approved}</div>
        </div>
        <div className="p-4 bg-white rounded shadow flex-1">
          <div>Pending</div>
          <div className="text-xl font-bold">{pending}</div>
        </div>
      </div>
    );
  }
}
