import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="min-h-screen lg:ml-64">
        <Topbar />
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8"><Dashboard /></main>
      </div>
    </div>
  );
}

export default App;
