// Generate mock attendance data
export function generateMockAttendance(startDate = null, days = 30) {
  const users = [
    { id: "u1", name: "Aman Verma" },
    { id: "u2", name: "Priya Singh" },
    { id: "u3", name: "Rahul Sharma" },
    { id: "u4", name: "Neha Patel" },
  ];
  const statuses = ["Present", "Late (¼ Day)", "Half Day", "Absent"];
  const out = [];
  const base = startDate ? new Date(startDate) : new Date();

  for (let i = 0; i < days; i++) {
    const day = new Date(base);
    day.setDate(base.getDate() - i);

    users.forEach((u) => {
      const r = Math.random();
      let status = "Present";
      if (r > 0.9) status = "Absent";
      else if (r > 0.75) status = "Half Day";
      else if (r > 0.45) status = "Late (¼ Day)";

      const punchIn =
        status === "Absent"
          ? null
          : status === "Half Day"
          ? "12:30"
          : status === "Late (¼ Day)"
          ? "10:15"
          : "09:55";
      const punchOut = status === "Absent" ? null : "18:00";

      out.push({
        id: `${u.id}-${day.toISOString().split("T")[0]}`,
        date: day.toISOString().split("T")[0],
        employeeId: u.id,
        employeeName: u.name,
        status,
        punchIn,
        punchOut,
        notes: "",
      });
    });
  }
  return out;
}

// Generate mock leave data
export function generateMockLeaves() {
  return [
    {
      id: 101,
      date: "2025-09-10",
      employeeName: "Aman Verma",
      type: "Paid",
      from: "2025-09-10",
      to: "2025-09-10",
      days: 1,
      reason: "Personal",
      status: "Approved",
    },
    {
      id: 102,
      date: "2025-09-18",
      employeeName: "Priya Singh",
      type: "Sick",
      from: "2025-09-20",
      to: "2025-09-21",
      days: 2,
      reason: "Fever",
      status: "Pending",
    },
    {
      id: 103,
      date: "2025-08-05",
      employeeName: "Neha Patel",
      type: "Casual",
      from: "2025-08-05",
      to: "2025-08-06",
      days: 2,
      reason: "Family",
      status: "Approved",
    },
  ];
}
