import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock3, HeartPulse, Info, MessageCircle, MoreHorizontal, Phone, ShieldAlert, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

const initialTasks = [
  { id: 1, title: "Complete daily check-in", description: "How are you feeling right now?", tag: "5 min", due: "Today", tone: "indigo", done: false },
  { id: 2, title: "Try your grounding exercise", description: "A short activity from your care plan", tag: "8 min", due: "Today", tone: "violet", done: false },
  { id: 3, title: "Review your safety plan", description: "Keep your supports and next steps nearby", tag: "10 min", due: "Tomorrow", tone: "amber", done: false },
  { id: 4, title: "Share a weekly reflection", description: "Help your care team understand your week", tag: "5 min", due: "Fri, 12 Sep", tone: "sky", done: false },
];

const trendData = [42, 51, 47, 60, 58, 66, 63, 71, 69, 76, 74, 82];
const days = ["29 Aug", "31 Aug", "2 Sep", "4 Sep", "6 Sep", "8 Sep"];

function TrendChart() {
  const width = 620, height = 220, padX = 10, padY = 18;
  const points = trendData.map((value, index) => {
    const x = padX + index * ((width - padX * 2) / (trendData.length - 1));
    const y = height - padY - ((value - 35) / 55) * (height - padY * 2);
    return `${x},${y}`;
  });
  const area = `M ${padX},${height - padY} L ${points.join(" L ")} L ${width - padX},${height - padY} Z`;
  return <div className="mt-4 overflow-hidden"><svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full overflow-visible" role="img" aria-label="Wellbeing trend increasing over the last 10 days">
    {[55, 75, 95, 115, 135, 155, 175].map((y) => <line key={y} x1="0" x2={width} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 5" />)}
    <defs><linearGradient id="wellbeing-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#818cf8" stopOpacity=".26"/><stop offset="100%" stopColor="#818cf8" stopOpacity="0"/></linearGradient></defs>
    <path d={area} fill="url(#wellbeing-fill)"/><polyline points={points.join(" ")} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {points.map((point, index) => <circle key={point} cx={point.split(",")[0]} cy={point.split(",")[1]} r={index === points.length - 1 ? 5 : 3} fill={index === points.length - 1 ? "#4f46e5" : "white"} stroke="#4f46e5" strokeWidth="2" />)}
  </svg><div className="flex justify-between px-1 text-[11px] text-slate-400">{days.map((day) => <span key={day}>{day}</span>)}</div></div>;
}

const StatusBadge = ({ children, tone = "indigo" }) => <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tone === "rose" ? "bg-rose-50 text-rose-700" : tone === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>{children}</span>;

const Dashboard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [period, setPeriod] = useState("10 days");
  const [message, setMessage] = useState("");
  const completed = tasks.filter((task) => task.done).length;
  const completion = useMemo(() => Math.round((completed / tasks.length) * 100), [completed, tasks.length]);
  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="mb-1 text-sm font-medium text-indigo-600">Monday, 8 September</p>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Good morning, Aanya</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">A gentle overview of your care plan, progress, and the next small steps you can take today.</p>
        </div>
      <button onClick={() => setMessage("Your care team has been notified that you’d like to talk.")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700">
        <MessageCircle size={17}/> Message care team</button>
    </section>
    {message && <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        <span>{message}</span>
    <button onClick={() => setMessage("")} aria-label="Dismiss message" className="font-bold">×</button>
    </div>}

    <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-6 text-white shadow-lg shadow-indigo-200 sm:p-7">
        <div className="absolute -right-10 -top-12 h-52 w-52 rounded-full bg-white/10"/>
        <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full border-[24px] border-white/10"/>
        <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge tone="emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Care plan active</StatusBadge>
                    <button className="rounded-lg p-1.5 text-indigo-100 hover:bg-white/10" aria-label="More care plan options"><MoreHorizontal size={20}/></button>
                    </div>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-sm font-medium text-indigo-200">Your next focus</p>
                <h3 className="mt-2 max-w-md text-xl font-semibold leading-7">Take a moment for today’s wellbeing check-in.</h3>
                <button onClick={() => toggleTask(1)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">Start check-in <ArrowRight size={16}/></button>
                </div>

                <div className="shrink-0 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-indigo-200">Plan progress</p>

                <p className="mt-1 text-2xl font-bold">{completion}%</p>

                <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/20">

                <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${completion}%` }}/></div>
                </div></div>

          <div className="mt-6 flex items-center gap-2 border-t border-white/15 pt-4 text-xs text-indigo-100"><ShieldAlert size={15}/>
          <span>This is a self-care dashboard, not an emergency service.</span>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between"><div>
            <p className="text-sm font-medium text-slate-500">Care profile</p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">Aanya Mehta</h3>
            <p className="mt-1 text-sm text-slate-500">Member since May 2026</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">AM</div>
            </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-slate-100 pt-5 text-sm">
            <div>
                <dt className="text-slate-400">Care coordinator</dt>
                <dd className="mt-1 font-medium text-slate-700">Dr. S. Kapoor</dd>
                </div>
                <div>
                    <dt className="text-slate-400">Preferred contact</dt>
                    <dd className="mt-1 font-medium text-slate-700">Secure message</dd>
                    </div>
                    <div>
                        <dt className="text-slate-400">Plan review</dt>
                        <dd className="mt-1 font-medium text-slate-700">18 Sep 2026</dd>
                    </div>
                    <div>
                        <dt className="text-slate-400">Support network</dt>
                        <dd className="mt-1 font-medium text-slate-700">3 contacts</dd>
                    </div>
                </dl>
        <button className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">View full profile</button>
      </article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.42fr_1fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div>
            <p className="text-sm font-medium text-slate-500">Today’s plan</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Small steps, at your pace</h3></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">{completed} of {tasks.length} complete</span>
            </div>
        <div className="mt-5 divide-y divide-slate-100">{tasks.map((task) => <div key={task.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
            <button aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`} onClick={() => toggleTask(task.id)} className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${task.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 hover:border-indigo-500"}`}>{task.done && <Check size={14} strokeWidth={3}/>}
            </button>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-semibold ${task.done ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</h4>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${task.tone === "amber" ? "bg-amber-50 text-amber-700" : task.tone === "violet" ? "bg-violet-50 text-violet-700" : "bg-indigo-50 text-indigo-700"}`}>{task.tag}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{task.description}</p>
                    </div>
                    <span className="shrink-0 pt-1 text-xs font-medium text-slate-400">{task.due}</span></div>)}
                    </div>
        <button className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Open care plan 
            <ArrowRight size={15}/></button>

      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">Upcoming support
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-slate-900">Your schedule</h3>
                </div><CalendarDays size={20} className="text-indigo-500"/>
                </div>
        <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
        <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                <span className="text-[10px] font-bold uppercase">Sep</span>
                <span className="text-base font-bold leading-4">10</span>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">Check-in with Dr. Kapoor</p>
                    <p className="mt-1 text-xs text-slate-500">Wednesday · 11:30 AM · Video visit</p>
                    <StatusBadge>Confirmed</StatusBadge>
                    </div>
                    </div>
                    </div>
        <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
                <Clock3 size={17} className="text-slate-400"/><span className="flex-1 text-slate-600">Guided breathing session</span>
                <span className="text-xs text-slate-400">Thu, 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Phone size={17} className="text-slate-400"/><span className="flex-1 text-slate-600">Peer support call</span>
                    <span className="text-xs text-slate-400">Sat, 10:00 AM</span>
                    </div></div>
        <button className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Manage appointments</button>
      </article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.42fr_1fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-medium text-slate-500">Wellbeing overview</p><div className="mt-1 flex items-center gap-2"><h3 className="text-xl font-bold text-slate-900">Your recent rhythm</h3><Info size={15} className="text-slate-400"/></div></div><div className="flex rounded-lg bg-slate-100 p-1">{["10 days", "30 days"].map((choice) => <button key={choice} onClick={() => setPeriod(choice)} className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${period === choice ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"}`}>{choice}</button>)}</div></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-xl bg-indigo-50 p-3.5"><p className="text-xs font-medium text-indigo-600">Check-in pattern</p><p className="mt-1 text-xl font-bold text-slate-800">{period === "10 days" ? "8 / 10" : "23 / 30"}</p><p className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><TrendingUp size={13}/> consistent</p></div><div className="rounded-xl bg-emerald-50 p-3.5"><p className="text-xs font-medium text-emerald-700">Stress signals</p><p className="mt-1 text-xl font-bold text-slate-800">Lower</p><p className="mt-1 flex items-center gap-1 text-xs text-emerald-600"><TrendingDown size={13}/> than last week</p></div><div className="col-span-2 rounded-xl bg-violet-50 p-3.5 sm:col-span-1"><p className="text-xs font-medium text-violet-700">Helpful activities</p><p className="mt-1 text-xl font-bold text-slate-800">6</p><p className="mt-1 text-xs text-violet-600">this week</p></div></div>
        <TrendChart /><p className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">Patterns are for reflection, not a clinical diagnosis. Bring any concerns to your care professional.</p>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2"><Sparkles size={19} className="text-amber-500"/><div><p className="text-sm font-medium text-slate-500">A gentle insight</p><h3 className="text-lg font-bold text-slate-900">What’s helping lately</h3></div></div><div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4"><HeartPulse size={22} className="text-amber-600"/><p className="mt-3 text-sm font-semibold leading-6 text-slate-800">Your check-ins tend to feel steadier on days you make time for a short grounding activity.</p><p className="mt-2 text-xs leading-5 text-slate-600">That’s a useful cue—not a rule. Keep choosing what feels manageable today.</p></div><div className="mt-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Your support tools</p><div className="mt-3 grid gap-2"><button className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"><span>Open grounding exercise</span><ArrowRight size={16} className="text-indigo-600"/></button><button className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50"><span>View safety plan</span><ArrowRight size={16} className="text-indigo-600"/></button></div></div><div className="mt-5 rounded-xl bg-rose-50 p-3 text-xs leading-5 text-rose-800"><b>Need urgent help?</b> Use your local emergency number or contact a trusted person. This dashboard cannot provide crisis support.</div></article>
    </section>
  </div>;
};

export default Dashboard;
