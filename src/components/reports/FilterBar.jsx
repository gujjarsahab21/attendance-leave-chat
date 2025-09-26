import React from "react";

export default function FilterBar({
  tab,
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  employeeSearch,
  setEmployeeSearch,
  leaveTypeFilter,
  setLeaveTypeFilter,
  exportAttendanceCSV,
  exportLeavesCSV,
  exportPrintable,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
      <select value={range} onChange={(e) => setRange(e.target.value)} className="p-2 border rounded">
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="month">This Month</option>
        <option value="custom">Custom</option>
      </select>
      {range === "custom" && (
        <>
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="p-2 border rounded"/>
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="p-2 border rounded"/>
        </>
      )}
      <input
        placeholder="Search Employee"
        value={employeeSearch}
        onChange={(e) => setEmployeeSearch(e.target.value)}
        className="p-2 border rounded"
      />
      {tab === "leaves" && (
        <select value={leaveTypeFilter} onChange={(e) => setLeaveTypeFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All Types</option>
          <option value="Paid">Paid</option>
          <option value="Sick">Sick</option>
          <option value="Casual">Casual</option>
        </select>
      )}
      <button onClick={() => tab === "attendance" ? exportPrintable("attendance") : exportPrintable("leaves")} className="px-3 py-2 bg-gray-200 rounded">
        Print
      </button>
    </div>
  );
}
