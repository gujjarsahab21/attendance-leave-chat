import {
  CheckCircleIcon,
  BellIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition flex flex-col gap-2">
          <CheckCircleIcon className="w-8 h-8 text-indigo-600" />
          <h2 className="text-gray-500 text-sm">Today’s Attendance</h2>
          <p className="text-2xl font-bold text-indigo-600">Not Marked</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition flex flex-col gap-2">
          <CalendarIcon className="w-8 h-8 text-green-600" />
          <h2 className="text-gray-500 text-sm">Leaves Left</h2>
          <p className="text-2xl font-bold text-green-600">3</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition flex flex-col gap-2">
          <BellIcon className="w-8 h-8 text-yellow-600" />
          <h2 className="text-gray-500 text-sm">Notifications</h2>
          <p className="text-2xl font-bold text-yellow-600">2</p>
        </div>
      </div>
    </div>
  );
}
  