import { useState, useEffect } from "react";
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Attendance() {
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [status, setStatus] = useState("Not Marked");
  const [attendanceHistory, setAttendanceHistory] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(currentTime.getMonth());
  const [calendarYear, setCalendarYear] = useState(currentTime.getFullYear());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunchIn = () => {
    const now = new Date();
    setPunchInTime(now);

    let newStatus = "Present";
    const hour = now.getHours();
    if (hour >= 10 && hour < 12) newStatus = "Late (¼ Day Deduction)";
    if (hour >= 12) newStatus = "Half Day";
    setStatus(newStatus);

    const dateKey = now.toLocaleDateString();
    setAttendanceHistory(prev => ({
      ...prev,
      [dateKey]: { status: newStatus, punchIn: now.toLocaleTimeString(), punchOut: null },
    }));

    toast.success(`Punch In marked: ${newStatus}`);
  };

  const handlePunchOut = () => {
    const now = new Date();
    setPunchOutTime(now);

    const dateKey = new Date().toLocaleDateString();
    setAttendanceHistory(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], punchOut: now.toLocaleTimeString() },
    }));

    toast.success("Punch Out marked successfully");
  };

  const getCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    const calendarDays = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({ day: prevMonthDays - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ day: i, currentMonth: true });
    }
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({ day: calendarDays.length - daysInMonth - firstDay + 1, currentMonth: false });
    }
    return calendarDays;
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else setCalendarMonth(calendarMonth - 1);
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else setCalendarMonth(calendarMonth + 1);
  };

  const renderDay = (dayObj) => {
    const dayDate = new Date(calendarYear, calendarMonth, dayObj.day);
    const dateKey = dayDate.toLocaleDateString();
    const todayKey = currentTime.toLocaleDateString();
    const history = attendanceHistory[dateKey];

    let bgColor = "bg-gray-50";
    if (history) {
      if (history.status.startsWith("Present")) bgColor = "bg-green-300";
      else if (history.status.startsWith("Late")) bgColor = "bg-yellow-300";
      else if (history.status.startsWith("Half")) bgColor = "bg-orange-300";
      else if (history.status === "Absent") bgColor = "bg-red-300";
    }

    const isToday = dateKey === todayKey;

    return (
      <div
        key={dateKey + Math.random()}
        className={`flex flex-col items-center justify-center h-10 w-10 m-0.5 cursor-pointer ${dayObj.currentMonth ? "" : "opacity-40"} ${isToday ? "ring-2 ring-indigo-500 rounded" : ""}`}
        title={
          history
            ? `Status: ${history.status}\nPunch In: ${history.punchIn || "-"}\nPunch Out: ${history.punchOut || "-"}`
            : ""
        }
      >
        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${bgColor} text-xs font-medium`}>
          {dayObj.day}
        </div>
      </div>
    );
  };

  const dayName = currentTime.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = currentTime.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Dashboard</h1>
        <p className="text-gray-600">{dayName}, {formattedDate}</p>
        <p className="text-gray-500 mt-1">Office Hours: 10:00 AM – 7:00 PM</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Punch Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-700">Punch Card</h2>
          </div>

          <p className="text-gray-500">
            Current Time: <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
          </p>
          <p className={`text-2xl font-bold ${status.startsWith("Present") ? "text-green-600" : status.startsWith("Late") ? "text-yellow-600" : status.startsWith("Half") ? "text-orange-600" : "text-gray-600"}`}>
            {status}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              className={`flex-1 py-2.5 rounded-lg font-medium shadow-md transition text-white ${punchInTime ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              onClick={handlePunchIn}
              disabled={!!punchInTime}
            >
              Punch In
            </button>
            <button
              className={`flex-1 py-2.5 rounded-lg font-medium shadow-md transition text-white ${!punchInTime || punchOutTime ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
              onClick={handlePunchOut}
              disabled={!punchInTime || !!punchOutTime}
            >
              Punch Out
            </button>
          </div>

          {punchInTime && <p className="text-sm text-gray-500 mt-2">Punch In Time: {punchInTime.toLocaleTimeString()}</p>}
          {punchOutTime && <p className="text-sm text-gray-500">Punch Out Time: {punchOutTime.toLocaleTimeString()}</p>}
        </div>

        {/* Compact Professional Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-indigo-600" /> Attendance Calendar
            </h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><ChevronLeftIcon className="w-4 h-4" /></button>
              <button onClick={nextMonth} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><ChevronRightIcon className="w-4 h-4" /></button>
            </div>
          </div>

          <p className="text-gray-600 font-medium text-center mb-2 text-sm">{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-1 text-xs">
            {weekdays.map((day) => <div key={day}>{day}</div>)}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {getCalendarDays().map(renderDay)}
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-300 rounded-full"></div> Present</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-300 rounded-full"></div> Late (¼ Day)</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-300 rounded-full"></div> Half Day</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-300 rounded-full"></div> Absent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
