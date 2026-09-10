import { useState } from "react";
import { BriefcaseBusiness, ChevronRight, HeartHandshake, LockKeyhole, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";

const Login = () => {
  const [role, setRole] = useState("victim");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isVictim = role === "victim";

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      setError("");
      setSubmitting(true);
      await api.post("/auth/login", { role, email: formData.get("email")?.trim(), password: formData.get("password") });
      navigate(isVictim ? "/dashboard" : "/counselor/dashboard");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "We could not sign you in. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="mx-auto max-w-2xl space-y-6 pb-8">
    <section className="text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><HeartHandshake size={24}/></div>
      <p className="text-sm font-semibold text-indigo-600">MindCare secure access</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">Choose your account type and sign in with the email address and password used during registration.</p>
    </section>

    <section className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={() => { setRole("victim"); setError(""); }} className={`rounded-2xl border p-5 text-left transition ${isVictim ? "border-indigo-500 bg-indigo-50 ring-3 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-200"}`}>
        <div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVictim ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}><UserRound size={20}/></div><div><p className="font-bold text-slate-800">Victim or survivor</p><p className="mt-1 text-sm leading-5 text-slate-500">Access your care dashboard.</p></div></div>
      </button>
      <button type="button" onClick={() => { setRole("counselor"); setError(""); }} className={`rounded-2xl border p-5 text-left transition ${!isVictim ? "border-indigo-500 bg-indigo-50 ring-3 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-200"}`}>
        <div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${!isVictim ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}><BriefcaseBusiness size={20}/></div><div><p className="font-bold text-slate-800">Counselor</p><p className="mt-1 text-sm leading-5 text-slate-500">Access your professional workspace.</p></div></div>
      </button>
    </section>

    <form onSubmit={submit} aria-busy={submitting} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 sm:px-7"><h3 className="text-xl font-bold text-slate-900">Sign in as a {isVictim ? "victim or survivor" : "counselor"}</h3><p className="mt-1 text-sm text-slate-500">Enter the credentials associated with this account.</p>{error && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{error}</p>}</div>
      <div className="space-y-5 p-5 sm:p-7">
        <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Email address<span className="ml-1 text-rose-500">*</span></span><input name="email" type="email" required autoComplete="email" placeholder={isVictim ? "name@example.com" : "name@practice.example"} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"/></label>
        <label className="block"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Password<span className="ml-1 text-rose-500">*</span></span><input name="password" type="password" required minLength={8} autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100"/></label>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 sm:px-7"><div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole size={15} className="text-emerald-600"/> Your credentials are protected</p><button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Signing in…" : <>Sign in <ChevronRight size={16}/></>}</button></div><p className="mt-4 text-center text-sm text-slate-600">New to MindCare? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link></p></div>
    </form>
  </div>;
};

export default Login;
