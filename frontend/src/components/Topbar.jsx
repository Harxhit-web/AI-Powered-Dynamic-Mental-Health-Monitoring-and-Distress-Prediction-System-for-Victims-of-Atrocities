import { Search, Bell, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Topbar = () => {
    const [lastUpdated] = useState('05 Sep 2026, 21:40 IST');
  return (
       <header className="h-14 border-b border-border bg-muted flex items-center gap-4 px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-secondary border border-border rounded-md px-3 py-1.5 w-72 group focus-within:border-primary transition-colors">
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search victim ID, case, district…"
          className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none w-full"
        />
        <span className="text-[10px] text-muted-foreground border border-border rounded px-1 shrink-0">⌘K</span>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Last updated */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-3">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
          <span>{lastUpdated}</span>
        </div>

      
        <button className="relative p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Notifications">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Help">
          <HelpCircle size={16} />
        </button>

        
      </div>
    </header>

  )
}

export default Topbar
