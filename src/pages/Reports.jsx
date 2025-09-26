import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

import {
  formatDateISO,
  formatDateNice,
  downloadCSV,
  openPrintView,
} from "../utils/reports";
import {
  generateMockAttendance,
  generateMockLeaves,
} from "../mock/reports";

import ReportTabs from "../components/reports/ReportTabs";
import SummaryCards from "../components/reports/SummaryCards";
import FilterBar from "../components/reports/FilterBar";
import AttendanceTable from "../components/reports/AttendanceTable";
import LeaveTable from "../components/reports/LeaveTable";

const QUICK_RANGES = [
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 days" },
  { key: "30days", label: "Last 30 days" },
  { key: "month", label: "This month" },
];

export default function Reports() {
  const [tab, setTab] = useState("attendance");
  const [attendanceData, setAttendanceData] = useState(() =>
    generateMockAttendance(undefined, 30)
  );
  const [leaveData, setLeaveData] = useState(() => generateMockLeaves());

  const [range, setRange] = useState("30days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // --- Filtering helpers (attendance + leaves) ---
  const filteredAttendance = useMemo(() => {
    let rows = [...attendanceData];
    const today = new Date();
    let fromDt = null;

    if (range === "today") fromDt = new Date(formatDateISO(today));
    else if (range === "7days") {
      fromDt = new Date(today);
      fromDt.setDate(today.getDate() - 6);
    } else if (range === "30days") {
      fromDt = new Date(today);
      fromDt.setDate(today.getDate() - 29);
    } else if (range === "month") {
      fromDt = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (range === "custom" && customFrom && customTo) {
      fromDt = new Date(customFrom);
    }

    if (fromDt) {
      const toDt =
        range === "custom" && customFrom && customTo
          ? new Date(customTo)
          : today;
      rows = rows.filter(
        (r) => r.date >= formatDateISO(fromDt) && r.date <= formatDateISO(toDt)
      );
    }

    if (employeeSearch.trim()) {
      rows = rows.filter((r) =>
        r.employeeName.toLowerCase().includes(employeeSearch.toLowerCase())
      );
    }

    return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [attendanceData, range, customFrom, customTo, employeeSearch]);

  const filteredLeaves = useMemo(() => {
    let rows = [...leaveData];
    const today = new Date();
    let fromDt = null;

    if (range === "today") fromDt = new Date(formatDateISO(today));
    else if (range === "7days") {
      fromDt = new Date(today);
      fromDt.setDate(today.getDate() - 6);
    } else if (range === "30days") {
      fromDt = new Date(today);
      fromDt.setDate(today.getDate() - 29);
    } else if (range === "month") {
      fromDt = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (range === "custom" && customFrom && customTo) {
      fromDt = new Date(customFrom);
    }

    if (fromDt) {
      const toDt =
        range === "custom" && customFrom && customTo
          ? new Date(customTo)
          : today;
      rows = rows.filter(
        (r) => r.from >= formatDateISO(fromDt) && r.from <= formatDateISO(toDt)
      );
    }

    if (employeeSearch.trim()) {
      rows = rows.filter((r) =>
        r.employeeName.toLowerCase().includes(employeeSearch.toLowerCase())
      );
    }

    if (leaveTypeFilter !== "all") {
      rows = rows.filter((r) => r.type === leaveTypeFilter);
    }

    return rows.sort((a, b) => (a.from < b.from ? 1 : -1));
  }, [leaveData, range, customFrom, customTo, employeeSearch, leaveTypeFilter]);

  // --- Pagination ---
  const pagedAttendance = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAttendance.slice(start, start + PAGE_SIZE);
  }, [filteredAttendance, page]);

  const pagedLeaves = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredLeaves.slice(start, start + PAGE_SIZE);
  }, [filteredLeaves, page]);

  useEffect(() => setPage(1), [
    range,
    customFrom,
    customTo,
    employeeSearch,
    leaveTypeFilter,
    tab,
  ]);

  // --- Export handlers ---
  function exportAttendanceCSV() {
    const rows = filteredAttendance.map((r) => ({
      Date: r.date,
      Employee: r.employeeName,
      Status: r.status,
      "Punch In": r.punchIn || "",
      "Punch Out": r.punchOut || "",
      Notes: r.notes || "",
    }));
    downloadCSV(`attendance_${formatDateISO(new Date())}.csv`, rows);
  }

  function exportLeavesCSV() {
    const rows = filteredLeaves.map((r) => ({
      Date: r.date,
      Employee: r.employeeName,
      Type: r.type,
      From: r.from,
      To: r.to,
      Days: r.days,
      Reason: r.reason,
      Status: r.status,
    }));
    downloadCSV(`leaves_${formatDateISO(new Date())}.csv`, rows);
  }

  function exportPrintable(type) {
    const html =
      type === "attendance"
        ? `<table><thead><tr><th>Date</th><th>Employee</th><th>Status</th></tr></thead>
           <tbody>${filteredAttendance
             .map(
               (r) =>
                 `<tr><td>${r.date}</td><td>${r.employeeName}</td><td>${r.status}</td></tr>`
             )
             .join("")}</tbody></table>`
        : `<table><thead><tr><th>From</th><th>Employee</th><th>Type</th></tr></thead>
           <tbody>${filteredLeaves
             .map(
               (r) =>
                 `<tr><td>${r.from}</td><td>${r.employeeName}</td><td>${r.type}</td></tr>`
             )
             .join("")}</tbody></table>`;
    openPrintView(`${type} Report`, html);
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-indigo-600" /> Reports
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAttendanceData(generateMockAttendance(undefined, 30));
                setLeaveData(generateMockLeaves());
                toast.success("Data refreshed");
              }}
              className="px-3 py-2 bg-white border rounded shadow-sm"
            >
              <ArrowPathIcon className="w-4 h-4 inline mr-1" /> Refresh
            </button>
            <button
              onClick={() =>
                tab === "attendance"
                  ? exportAttendanceCSV()
                  : exportLeavesCSV()
              }
              className="px-3 py-2 bg-indigo-600 text-white rounded shadow-sm"
            >
              <DocumentArrowDownIcon className="w-4 h-4 inline mr-1" /> Export
            </button>
          </div>
        </div>

        <ReportTabs tab={tab} setTab={setTab} />
        <SummaryCards tab={tab} attendanceData={attendanceData} leaveData={leaveData} />
        <FilterBar
          tab={tab}
          range={range}
          setRange={setRange}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
          employeeSearch={employeeSearch}
          setEmployeeSearch={setEmployeeSearch}
          leaveTypeFilter={leaveTypeFilter}
          setLeaveTypeFilter={setLeaveTypeFilter}
          exportAttendanceCSV={exportAttendanceCSV}
          exportLeavesCSV={exportLeavesCSV}
          exportPrintable={exportPrintable}
        />

        {tab === "attendance" ? (
          <AttendanceTable data={pagedAttendance} />
        ) : (
          <LeaveTable data={pagedLeaves} />
        )}
      </div>
    </div>
  );
}
