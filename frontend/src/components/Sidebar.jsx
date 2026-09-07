
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Activity,
  CalendarDays,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Profile",
      icon: User,
    },
    {
      name: "Assessments",
      icon: ClipboardCheck,
    },
    {
      name: "Mental Health",
      icon: Activity,
    },
    {
      name: "Appointments",
      icon: CalendarDays,
    },
    {
      name: "Messages",
      icon: MessageSquare,
      badge: 3,
    },
    {
      name: "Notifications",
      icon: Bell,
      badge: 5,
    },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200
      flex flex-col transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* ================= LOGO ================= */}
      <div
        className={`h-20 flex items-center border-b border-gray-200
        ${collapsed ? "justify-center" : "justify-between px-5"}`}
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600
              flex items-center justify-center text-white font-bold">
              MH
            </div>

            <div>
              <h1 className="font-bold text-gray-800">
                MindCare
              </h1>
              <p className="text-xs text-gray-500">
                Mental Health
              </p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-indigo-600
            flex items-center justify-center text-white font-bold">
            MH
          </div>
        )}
      </div>

      {/* ================= MENU ================= */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">

        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-semibold
            uppercase tracking-wider text-gray-400">
            Main Menu
          </p>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              title={collapsed ? item.name : ""}
              className={`w-full flex items-center gap-3
                rounded-xl transition-all duration-200
                ${collapsed ? "justify-center px-3" : "px-3"}
                py-3
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                }`}
            >
              <Icon
                size={21}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">
                    {item.name}
                  </span>

                  {item.badge && (
                    <span className="min-w-5 h-5 px-1 rounded-full
                      bg-red-500 text-white text-xs
                      flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="px-3 pb-4 space-y-2">

        {/* Settings */}
        <button
          title={collapsed ? "Settings" : ""}
          className={`w-full flex items-center gap-3
            px-3 py-3 rounded-xl
            text-gray-600 hover:bg-gray-50
            hover:text-indigo-600 transition
            ${collapsed ? "justify-center" : ""}`}
        >
          <Settings size={21} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Settings
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          title={collapsed ? "Logout" : ""}
          className={`w-full flex items-center gap-3
            px-3 py-3 rounded-xl
            text-red-500 hover:bg-red-50
            transition
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={21} />

          {!collapsed && (
            <span className="text-sm font-medium">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* ================= USER PROFILE ================= */}
      <div className="border-t border-gray-200 p-3">
        <div
          className={`flex items-center gap-3
          ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-10 h-10 rounded-full
            bg-indigo-100 text-indigo-600
            flex items-center justify-center
            font-semibold">
            HB
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                User Name
              </p>
              <p className="text-xs text-gray-500 truncate">
                Victim
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= COLLAPSE BUTTON ================= */}
      <div className="absolute left-0 bottom-20 translate-x-1/2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-full
            bg-white border border-gray-200
            shadow-sm flex items-center justify-center
            text-gray-600 hover:text-indigo-600
            hover:border-indigo-300 transition"
        >
          {collapsed ? (
            <Menu size={17} />
          ) : (
            <ChevronLeft size={17} />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


