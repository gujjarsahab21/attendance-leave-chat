import React from "react";

export default function AttendanceTable({ data }) {
  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Employee</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Punch In</th>
          <th className="p-2 border">Punch Out</th>
          <th className="p-2 border">Notes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id}>
            <td className="p-2 border">{r.date}</td>
            <td className="p-2 border">{r.employeeName}</td>
            <td className="p-2 border">{r.status}</td>
            <td className="p-2 border">{r.punchIn || "-"}</td>
            <td className="p-2 border">{r.punchOut || "-"}</td>
            <td className="p-2 border">{r.notes || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
