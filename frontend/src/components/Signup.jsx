import { useState } from "react";
import { BriefcaseBusiness, CheckCircle2, ChevronRight, HeartHandshake, LockKeyhole, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";

const Field = ({ label, name, type = "text", required = true, placeholder, children, span = false, autoComplete, minLength }) => <label className={`block ${span ? "sm:col-span-2" : ""}`}>
  <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>
  {children || <input name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} minLength={minLength} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100" />}
</label>;

const SelectField = ({ label, name, children, required = true }) => <Field label={label} name={name} required={required}>
  <select name={name} required={required} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100">{children}</select>
</Field>;

const Signup = () => {
  const [role, setRole] = useState("victim");
  const [submitted, setSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const isVictim = role === "victim";

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setPasswordError("Passwords do not match. Please enter them again.");
      return;
    }
    setPasswordError("");
    setSubmissionError("");
    const value = (name) => formData.get(name)?.trim();
    const optionalValue = (name) => value(name) || null;
    const payload = isVictim ? {
      full_name: value("fullName"), date_of_birth: value("dateOfBirth"), gender: value("gender"), primary_language: value("language"), phone: value("phone"), email: value("email"), password: formData.get("password"), contact_preference: value("contactPreference"), safe_contact_hours: optionalValue("contactHours"), address: value("address"), city: value("city"), state: value("state"), postal_code: value("postalCode"), country: value("country"), emergency_name: value("emergencyName"), emergency_relation: value("emergencyRelation"), emergency_phone: value("emergencyPhone"), emergency_email: optionalValue("emergencyEmail"), consent_given: formData.get("consentGiven") === "on",
    } : {
      full_name: value("fullName"), professional_title: value("title"), work_email: value("email"), work_phone: value("phone"), password: formData.get("password"), license_number: value("licenseNumber"), issuing_body: value("issuingBody"), specialization: value("specialization"), years_of_experience: Number(formData.get("experience")), organization: value("organization"), work_address: value("workAddress"), city: value("city"), state: value("state"), service_mode: value("serviceMode"), availability: value("availability"),
    };
    try {
      setSubmitting(true);
      await api.post(isVictim ? "/victims" : "/counselors", payload);
      setSubmitted(true);
    } catch (error) {
      setSubmissionError(getApiErrorMessage(error, "We could not create your account. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };
  const changeRole = (nextRole) => { setRole(nextRole); setSubmitted(false); setPasswordError(""); setSubmissionError(""); };

  return <div className="mx-auto max-w-5xl space-y-6 pb-8">
    <section className="text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><HeartHandshake size={24}/></div><p className="text-sm font-semibold text-indigo-600">MindCare secure registration</p><h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Create your account</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">Choose how you will use MindCare. We only ask for details needed to set up your account and coordinate care safely.</p><p className="mt-3 text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link></p></section>

    <section className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => changeRole("victim")} className={`rounded-2xl border p-5 text-left transition ${isVictim ? "border-indigo-500 bg-indigo-50 ring-3 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-200"}`}><div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isVictim ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}><UserRound size={20}/></div><div><p className="font-bold text-slate-800">I am seeking support</p><p className="mt-1 text-sm leading-5 text-slate-500">Register as a victim or survivor and set up your personal care profile.</p></div></div></button><button type="button" onClick={() => changeRole("counselor")} className={`rounded-2xl border p-5 text-left transition ${!isVictim ? "border-indigo-500 bg-indigo-50 ring-3 ring-indigo-100" : "border-slate-200 bg-white hover:border-indigo-200"}`}><div className="flex items-start gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${!isVictim ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}><BriefcaseBusiness size={20}/></div><div><p className="font-bold text-slate-800">I am a counselor</p><p className="mt-1 text-sm leading-5 text-slate-500">Register as a care professional and submit your professional details.</p></div></div></button></section>

    {submitted ? <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><CheckCircle2 size={38} className="mx-auto text-emerald-600"/><h3 className="mt-3 text-xl font-bold text-emerald-900">Account created successfully</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-emerald-800">Your {isVictim ? "care profile" : "professional profile"} has been saved securely. Sign in with your email address and password to continue.</p><div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={() => setSubmitted(false)} className="rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">Create another account</button><button onClick={() => navigate("/login")} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Sign in</button></div></section> : <form onSubmit={submit} aria-busy={submitting} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 sm:px-7"><p className="text-sm font-semibold text-indigo-600">Step 1 of 1</p><h3 className="mt-1 text-xl font-bold text-slate-900">{isVictim ? "Your personal and support details" : "Your professional details"}</h3><p className="mt-1 text-sm text-slate-500">Fields marked with * are required.</p>{submissionError && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{submissionError}</p>}</div>

      {isVictim ? <div className="space-y-8 p-5 sm:p-7">
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Personal information</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="fullName" placeholder="Enter your full name"/><Field label="Date of birth" name="dateOfBirth" type="date"/><SelectField label="Gender" name="gender"><option value="">Select gender</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer not to say</option></SelectField><Field label="Primary language" name="language" placeholder="e.g. Hindi, English"/></div></fieldset>
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Contact details</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="Mobile number" name="phone" type="tel" placeholder="e.g. +91 98XXX XXXXX"/><Field label="Email address" name="email" type="email" placeholder="name@example.com" autoComplete="email"/><SelectField label="Preferred contact" name="contactPreference"><option value="">Choose a preference</option><option>Secure message</option><option>Phone call</option><option>Email</option></SelectField><Field label="Safe contact hours" name="contactHours" placeholder="e.g. Weekdays, 9 AM - 6 PM" required={false}/></div></fieldset>
        <fieldset><legend className="mb-1 text-base font-bold text-slate-800">Account security</legend><p className="mb-4 text-sm text-slate-500">Create a password with at least 8 characters to use when signing in.</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Create password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8}/><Field label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" minLength={8}/></div>{passwordError && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{passwordError}</p>}</fieldset>
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Current address</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="Address line" name="address" placeholder="House / street / locality" span/><Field label="City or district" name="city" placeholder="Enter city or district"/><Field label="State or region" name="state" placeholder="Enter state or region"/><Field label="Postal / PIN code" name="postalCode" placeholder="Enter postal code"/><Field label="Country" name="country" placeholder="Enter country"/></div></fieldset>
        <fieldset><legend className="mb-1 text-base font-bold text-slate-800">Emergency contact</legend><p className="mb-4 text-sm text-slate-500">A trusted person your care team may contact according to your consent settings.</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Contact name" name="emergencyName" placeholder="Full name"/><Field label="Relationship" name="emergencyRelation" placeholder="e.g. Parent, sibling, friend"/><Field label="Contact phone" name="emergencyPhone" type="tel" placeholder="e.g. +91 98XXX XXXXX"/><Field label="Emergency contact email" name="emergencyEmail" type="email" placeholder="Optional" required={false}/></div></fieldset>
      </div> : <div className="space-y-8 p-5 sm:p-7">
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Professional identity</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="fullName" placeholder="Enter your full name"/><Field label="Professional title" name="title" placeholder="e.g. Licensed Clinical Psychologist"/><Field label="Work email" name="email" type="email" placeholder="name@practice.example" autoComplete="email"/><Field label="Work phone" name="phone" type="tel" placeholder="e.g. +91 98XXX XXXXX"/></div></fieldset>
        <fieldset><legend className="mb-1 text-base font-bold text-slate-800">Account security</legend><p className="mb-4 text-sm text-slate-500">Create a password with at least 8 characters to use when signing in.</p><div className="grid gap-4 sm:grid-cols-2"><Field label="Create password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8}/><Field label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password" minLength={8}/></div>{passwordError && <p role="alert" className="mt-3 text-sm font-medium text-rose-600">{passwordError}</p>}</fieldset>
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Credentials and practice</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="License / registration number" name="licenseNumber" placeholder="Enter registration number"/><Field label="Issuing body" name="issuingBody" placeholder="e.g. State medical council"/><Field label="Primary specialization" name="specialization" placeholder="e.g. Trauma-informed counseling"/><Field label="Years of experience" name="experience" type="number" placeholder="Enter years"/><Field label="Organization or practice name" name="organization" placeholder="Enter organization name" span/></div></fieldset>
        <fieldset><legend className="mb-4 text-base font-bold text-slate-800">Practice location and availability</legend><div className="grid gap-4 sm:grid-cols-2"><Field label="Work address" name="workAddress" placeholder="Office / street / locality" span/><Field label="City or district" name="city" placeholder="Enter city or district"/><Field label="State or region" name="state" placeholder="Enter state or region"/><SelectField label="Primary service mode" name="serviceMode"><option value="">Select service mode</option><option>In person</option><option>Video consultation</option><option>Both</option></SelectField><Field label="Usual availability" name="availability" placeholder="e.g. Mon - Fri, 10 AM - 5 PM"/></div></fieldset>
      </div>}

      <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 sm:px-7"><label className="flex gap-3 text-sm leading-5 text-slate-600"><input name="consentGiven" required type="checkbox" className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/><span>I confirm that the information I provided is accurate and I agree to the secure handling of this data for account setup and care coordination.</span></label><div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-xs text-slate-500"><LockKeyhole size={15} className="text-emerald-600"/> Protected by secure data controls</div><button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">{submitting ? "Creating account…" : <>Create {isVictim ? "care" : "counselor"} account <ChevronRight size={16}/></>}</button></div></div>
    </form>}
  </div>;
};

export default Signup;
