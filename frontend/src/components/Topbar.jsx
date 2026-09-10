import { Bell, HelpCircle, Search, ShieldCheck } from "lucide-react";

const Topbar = ({ role = "victim", account }) => (
  <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
    
    <div className="hidden w-72 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-colors focus-within:border-indigo-400 focus-within:bg-white sm:flex">
      
      <Search size={15} className="shrink-0 text-slate-400" />
      
      <input type="search" placeholder={role === "counselor" ? "Search caseload or case ID" : "Search care plan or support"} className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none" />

      <span className="shrink-0 rounded border border-slate-200 px-1 text-[10px] text-slate-400">⌘K</span>

    </div>
    <div className="ml-auto flex items-center gap-1">
      <p className="mr-2 hidden text-sm font-semibold text-slate-700 lg:block">{account?.full_name}</p>
      <div className="mr-2 hidden items-center gap-1.5 text-xs text-slate-500 md:flex">
        
        <ShieldCheck size={15} className="text-emerald-600" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

        <span>Private &amp; secure</span>

      </div>
      <button className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800" title="Notifications">

        <Bell size={18} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />

      </button>

      <button className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800" title="Help"><HelpCircle size={18} />
      </button>
    </div>
    
  </header>
);

export default Topbar;
