import React from "react";

export default function LeaveTable({ data }) {
  return (
    <table className="w-full bg-white rounded shadow overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Employee</th>
          <th className="p-2 border">Type</th>
          <th className="p-2 border">From</th>
          <th className="p-2 border">To</th>
          <th className="p-2 border">Days</th>
          <th className="p-2 border">Reason</th>
          <th className="p-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.id}>
            <td className="p-2 border">{r.date}</td>
            <td className="p-2 border">{r.employeeName}</td>
            <td className="p-2 border">{r.type}</td>
            <td className="p-2 border">{r.from}</td>
            <td className="p-2 border">{r.to}</td>
            <td className="p-2 border">{r.days}</td>
            <td className="p-2 border">{r.reason}</td>
            <td className="p-2 border">{r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
