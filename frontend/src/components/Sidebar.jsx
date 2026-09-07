import { Activity, Bell, CalendarDays, ClipboardCheck, LayoutDashboard, LogOut, MessageSquare, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/dashboard", end: true },
  { name: "My profile", icon: User, to: "/profile" },
  { name: "Check-ins", icon: ClipboardCheck },
  { name: "Wellbeing", icon: Activity },
  { name: "Appointments", icon: CalendarDays },
  { name: "Messages", icon: MessageSquare, badge: 3 },
  { name: "Notifications", icon: Bell, badge: 2 },
];

const itemStyle = (active) => `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`;

const Sidebar = () => <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
  <div className="flex h-20 items-center border-b border-slate-200 px-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">MC</div><div><h1 className="font-bold text-slate-800">MindCare</h1><p className="text-xs text-slate-500">Care portal</p></div></div></div>
  <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6"><p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Care center</p>
    {menuItems.map((item) => {
      const Icon = item.icon;
      const content = <><Icon size={20}/><span className="flex-1 text-sm font-medium">{item.name}</span>{item.badge && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs text-white">{item.badge}</span>}</>;
      return item.to ? <NavLink key={item.name} to={item.to} end={item.end} className={({ isActive }) => itemStyle(isActive)}>{content}</NavLink> : <button key={item.name} className={itemStyle(false)}>{content}</button>;
    })}
  </nav>
  <div className="space-y-2 px-3 pb-4"><button className={itemStyle(false)}><Settings size={20}/><span className="text-sm font-medium">Settings</span></button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-rose-500 transition hover:bg-rose-50"><LogOut size={20}/><span className="text-sm font-medium">Sign out</span></button></div>
  <NavLink to="/profile" className="border-t border-slate-200 p-3 transition hover:bg-slate-50"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">AM</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">Aanya Mehta</p><p className="truncate text-xs text-slate-500">Private care account</p></div></div></NavLink>
</aside>;

export default Sidebar;
