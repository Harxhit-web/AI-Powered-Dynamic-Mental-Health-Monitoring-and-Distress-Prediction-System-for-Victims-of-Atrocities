import { useEffect, useState } from "react";
import { Check, Edit3, IdCard, LockKeyhole, Mail, MapPin, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import api, { getApiErrorMessage } from "../services/api";
import { getInitials } from "../context/AuthContext";

const ProfileField = ({ icon: Icon, label, children, span = false }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <dt className="flex items-center gap-2 text-xs font-medium text-slate-400"><Icon size={14} />{label}</dt>
    <dd className="mt-1.5 text-sm font-semibold leading-5 text-slate-700">{children}</dd>
  </div>
);

const Profile = () => {
  const [addressVisible, setAddressVisible] = useState(true);
  const [notice, setNotice] = useState("");
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => { let active = true; api.get("/auth/profile").then(({ data }) => { if (active) setProfile(data); }).catch((error) => { if (active) setLoadError(getApiErrorMessage(error, "We could not load your profile.")); }); return () => { active = false; }; }, []);
  const value = (item) => item || "—";
  const fullName = value(profile?.full_name);
  const address = [profile?.address, profile?.city, profile?.state, profile?.postal_code, profile?.country].filter(Boolean).join(", ");
  const emergencyContact = [profile?.emergency_name, profile?.emergency_relation && `(${profile.emergency_relation})`, profile?.emergency_phone].filter(Boolean).join(" · ");
  const preferredContact = [profile?.contact_preference, profile?.safe_contact_hours].filter(Boolean).join(", ");
  const dateOfBirth = profile?.date_of_birth ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${profile.date_of_birth}T00:00:00`)) : "—";

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="mb-1 text-sm font-medium text-indigo-600">Your account</p><h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My profile</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep your contact, location, and emergency information current so your care team can support you safely.</p></div>
      <button onClick={() => setNotice("Profile editing can be connected to your secure account form.")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700"><Edit3 size={16}/> Edit profile</button>
    </section>

    {notice && <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss" className="font-bold">x</button></div>}
    {loadError && <div role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{loadError}</div>}

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-md shadow-indigo-200">{getInitials(profile?.full_name)}</div><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold text-slate-900">{fullName}</h3><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><Check size={12} strokeWidth={3}/> Profile verified</span></div><p className="mt-1 text-sm text-slate-500">Member ID: {profile?.id || "—"}</p></div></div>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500"><ShieldCheck size={18} className="text-emerald-600"/> Information protected</div>
      </div>

      <div className="grid divide-y divide-slate-100 lg:grid-cols-[1.05fr_1fr_1fr] lg:divide-x lg:divide-y-0">
        <article className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><UserRound size={18} className="text-indigo-600"/><h4 className="font-bold text-slate-800">Personal information</h4></div><dl className="grid grid-cols-2 gap-x-5 gap-y-5"><ProfileField icon={UserRound} label="Full name">{fullName}</ProfileField><ProfileField icon={IdCard} label="Date of birth">{dateOfBirth}</ProfileField><ProfileField icon={IdCard} label="Gender">{value(profile?.gender)}</ProfileField><ProfileField icon={IdCard} label="Primary language">{value(profile?.primary_language)}</ProfileField><ProfileField icon={IdCard} label="Member ID" span>{profile?.id || "—"}</ProfileField></dl></article>
        <article className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><Phone size={18} className="text-indigo-600"/><h4 className="font-bold text-slate-800">Contact details</h4></div><dl className="space-y-5"><ProfileField icon={Phone} label="Mobile number">{value(profile?.phone)}</ProfileField><ProfileField icon={Mail} label="Email address">{value(profile?.email)}</ProfileField><ProfileField icon={MessageCircle} label="Preferred contact">{value(preferredContact)}</ProfileField></dl></article>
        <article className="p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><MapPin size={18} className="text-indigo-600"/><h4 className="font-bold text-slate-800">Home &amp; emergency</h4></div><dl className="space-y-5"><ProfileField icon={MapPin} label="Current address">{addressVisible ? value(address) : "Address hidden for privacy"}</ProfileField><ProfileField icon={Phone} label="Emergency contact">{value(emergencyContact)}</ProfileField></dl><button onClick={() => setAddressVisible((current) => !current)} className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800">{addressVisible ? "Hide address" : "Show address"}</button></article>
      </div>
      <div className="flex flex-col gap-2 border-t border-amber-100 bg-amber-50 px-5 py-3 text-xs leading-5 text-amber-800 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span><b>Privacy note:</b> Address and contact information are available only to authorized care staff.</span><button onClick={() => setNotice("Sharing preferences can be managed through your privacy settings.")} className="shrink-0 text-left font-bold hover:underline">Manage sharing</button></div>
    </section>

    <section className="grid gap-5 md:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Phone size={18} className="text-indigo-600"/><h3 className="font-bold text-slate-800">Emergency support contact</h3></div><p className="mt-3 text-sm leading-6 text-slate-500">Your emergency contact is notified only according to the preferences and consent you set with your care team.</p><button className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Update emergency contact</button></article><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><LockKeyhole size={18} className="text-indigo-600"/><h3 className="font-bold text-slate-800">Account privacy</h3></div><p className="mt-3 text-sm leading-6 text-slate-500">Review where your information is shared and which members of your care team can access it.</p><button onClick={() => setNotice("Sharing preferences can be managed through your privacy settings.")} className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Review privacy settings</button></article></section>
  </div>;
};

export default Profile;
