import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";
import {
  PlusIcon,
  TrashIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const STORAGE_KEY = "holidays_v1";

const HOLIDAY_TYPES = [
  { value: "Festival", label: "Festival Holiday" },
  { value: "Company", label: "Company Holiday" },
  { value: "Optional", label: "Optional Holiday" },
];

function formatISODate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export default function HolidayCalendar() {
  const [isAdmin] = useState(true); // mock role
  const [holidays, setHolidays] = useState(() => loadFromStorage());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    date: formatISODate(new Date()),
    type: HOLIDAY_TYPES[0].value,
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  useEffect(() => {
    saveToStorage(holidays);
  }, [holidays]);

  const upcoming = useMemo(() => {
    const today = formatISODate(new Date());
    return [...holidays]
      .filter((h) => h.date >= today)
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [holidays]);

  const holidayMap = useMemo(() => {
    const map = {};
    holidays.forEach((h) => {
      map[h.date] = [...(map[h.date] || []), h];
    });
    return map;
  }, [holidays]);

  // form helpers
  function resetForm() {
    setForm({
      name: "",
      date: formatISODate(new Date()),
      type: HOLIDAY_TYPES[0].value,
      note: "",
    });
    setErrors({});
  }

  function validateForm() {
    const e = {};
    if (!form.name || form.name.trim().length < 2) e.name = "Enter holiday name";
    if (!form.date) e.date = "Select date";
    if (holidays.some((h) => h.date === form.date && h.name === form.name.trim()))
      e.duplicate = "Holiday with same name & date already exists";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleOpenAdd() {
    resetForm();
    setIsModalOpen(true);
  }

  function handleAddHoliday(e) {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }
    const newHoliday = {
      id: Date.now(),
      name: form.name.trim(),
      date: form.date,
      type: form.type,
      note: form.note.trim(),
    };
    setHolidays((p) => {
      const next = [...p, newHoliday];
      next.sort((a, b) => (a.date < b.date ? -1 : 1));
      return next;
    });
    toast.success("Holiday added");
    setIsModalOpen(false);
    setCalendarViewDate(new Date(form.date));
  }

  function handleDeleteHoliday(id) {
    if (!confirm("Delete this holiday?")) return;
    setHolidays((p) => p.filter((h) => h.id !== id));
    toast.success("Holiday deleted");
  }

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = formatISODate(date);
    const list = holidayMap[key];
    if (!list) return null;
    return (
      <div className="flex flex-col items-center mt-1">
        {list.slice(0, 2).map((h) => (
          <div
            key={h.id}
            className={`px-1 text-xs rounded-full truncate text-white ${
              h.type === "Festival"
                ? "bg-indigo-600"
                : h.type === "Company"
                ? "bg-emerald-600"
                : "bg-amber-600"
            }`}
            title={`${h.name} — ${h.type}${h.note ? `\n${h.note}` : ""}`}
            style={{ maxWidth: "58px" }}
          >
            {h.name.length > 10 ? `${h.name.slice(0, 10)}…` : h.name}
          </div>
        ))}
        {list.length > 2 && (
          <div className="text-[10px] text-gray-400">+{list.length - 2}</div>
        )}
      </div>
    );
  };

  function handleDateClick(date) {
    setSelectedDate(date);
    const key = formatISODate(date);
    if (holidayMap[key]) {
      const el = document.getElementById(`holiday-list-${key}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setCalendarViewDate(date);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Holiday Calendar</h1>
          <p className="text-gray-600">
            View and manage company holidays. Admin/HR can add or remove.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-4 h-4" /> Add Holiday
          </button>
        )}
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-indigo-600" />
              {calendarViewDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCalendarViewDate(
                    (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)
                  )
                }
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCalendarViewDate(
                    (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)
                  )
                }
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="react-calendar-wrapper">
            <Calendar
              onClickDay={handleDateClick}
              value={selectedDate}
              activeStartDate={calendarViewDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setCalendarViewDate(activeStartDate)
              }
              tileContent={tileContent}
              className="react-calendar border-none rounded-lg shadow-sm p-2"
            />
          </div>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-indigo-600 rounded-full" />
              Festival
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-emerald-600 rounded-full" />
              Company
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-amber-600 rounded-full" />
              Optional
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">
              Upcoming Holidays
            </h3>
            <span className="text-sm text-gray-500">
              {holidays.length} total
            </span>
          </div>
          <div className="space-y-3 overflow-auto max-h-[56vh] pr-2">

            {upcoming.length === 0 && (
              <div className="text-gray-500 text-sm">No upcoming holidays.</div>
            )}
            {upcoming.map((h) => (
              <div
                id={`holiday-list-${h.date}`}
                key={h.id}
                className="flex items-start justify-between gap-3 p-3 border rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-white ${
                      h.type === "Festival"
                        ? "bg-indigo-600"
                        : h.type === "Company"
                        ? "bg-emerald-600"
                        : "bg-amber-600"
                    }`}
                  >
                    <span className="text-xs font-semibold">
                      {new Date(h.date).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{h.name}</div>
                    <div className="text-xs text-gray-500">
                      {h.type} • {h.date}
                      {h.note ? ` • ${h.note}` : ""}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteHoliday(h.id)}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                    title="Delete holiday"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Showing upcoming holidays only. Contact HR/Admin to add or update.
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4 border-b pb-2">
              <h4 className="text-lg font-semibold text-gray-700">
                Add Holiday
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Holiday Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-indigo-200"
                  }`}
                  placeholder="e.g., Diwali"
                />
                {errors.name && (
                  <div className="text-xs text-red-500 mt-1">{errors.name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.date
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-200 focus:ring-indigo-200"
                  }`}
                />
                {errors.date && (
                  <div className="text-xs text-red-500 mt-1">{errors.date}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-200 focus:ring-indigo-200"
                >
                  {HOLIDAY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Note (optional)
                </label>
                <textarea
                  rows="2"
                  value={form.note}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, note: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-200 focus:ring-indigo-200"
                  placeholder="Short note for this holiday"
                />
              </div>
              {errors.duplicate && (
                <div className="text-xs text-red-500">{errors.duplicate}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
