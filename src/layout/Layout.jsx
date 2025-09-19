import { Outlet, Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ClockIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import Login from "../pages/Login";

export default function Layout() {
  const location = useLocation();

  const menu = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { path: "/attendance", label: "Attendance", icon: ClockIcon },
    { path: "/leave", label: "Leave", icon: CalendarIcon },
    { path: "/holidays", label: "Holidays", icon: CalendarIcon },
    { path: "/chat", label: "Chat", icon: ChatBubbleLeftRightIcon },
    { path: "/reports", label: "Reports", icon: DocumentChartBarIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-indigo-600 text-xl border-b">
          Company Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  active
                    ? "bg-indigo-100 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center rounded-b-xl">
          <h1 className="text-lg font-semibold capitalize">
            {menu.find((i) => i.path === location.pathname)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-gray-700 font-medium">John Doe <p className="text-gray-500 text-sm">Software Engineer</p></span>
            
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-8 h-8 rounded-full border"
            />  
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
