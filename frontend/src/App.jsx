import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Checkin from "./components/Checkin";
import Wellbeing from "./components/wellbeing";
import Appointments from "./components/Appointments";
import Saathi from "./components/Saathi";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import CounselorDashboard from "./counselor/Dashboard";
import CounselorProfile from "./counselor/Profile";
import Caseload from "./counselor/Caseload";
import Analytics from "./counselor/Analytics";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

function App() {
  const isCounselor = useLocation().pathname.startsWith("/counselor");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar role={isCounselor ? "counselor" : "victim"} />
      <div className="min-h-screen lg:ml-64">
        <Topbar role={isCounselor ? "counselor" : "victim"} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/check-in" element={<Checkin />} />
            <Route path="/wellbeing" element={<Wellbeing />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/talk-with-saathi" element={<Saathi />} />
            <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
            <Route path="/counselor/profile" element={<CounselorProfile />} />
            <Route path="/counselor/caseload" element={<Caseload />} />
            <Route path="/counselor/analytics" element={<Analytics />} />
            <Route path="/counselor-dashboard" element={<Navigate to="/counselor/dashboard" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
