import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Checkin from "./components/Checkin";
import Wellbeing from "./components/wellbeing";
import Appointments from "./components/Appointments";
import Saathi from "./components/Saathi";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CounselorDashboard from "./counselor/Dashboard";
import CounselorProfile from "./counselor/Profile";
import Caseload from "./counselor/Caseload";
import Analytics from "./counselor/Analytics";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

const FullPageLoader = () => <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500">Loading your secure workspace…</div>;

function ProtectedWorkspace({ children, isCounselor }) {
  const { account, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!account) return <Navigate to="/login" replace />;
  if ((account.role === "counselor") !== isCounselor) return <Navigate to={account.role === "counselor" ? "/counselor/dashboard" : "/dashboard"} replace />;
  return <div className="min-h-screen bg-slate-50 text-slate-900"><Sidebar role={account.role} account={account} /><div className="min-h-screen lg:ml-64"><Topbar role={account.role} account={account} /><main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main></div></div>;
}

function App() {
  const location = useLocation();
  const isPublicRoute = ["/", "/signup", "/login"].includes(location.pathname);
  const isCounselor = location.pathname.startsWith("/counselor");
  const routes = <Routes>
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
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>;
  return <AuthProvider enabled={!isPublicRoute}>{isPublicRoute ? <div className="min-h-screen bg-slate-50 text-slate-900"><main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{routes}</main></div> : <ProtectedWorkspace isCounselor={isCounselor}>{routes}</ProtectedWorkspace>}</AuthProvider>;
}

export default App;
