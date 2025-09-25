import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./Login";
import CandidateList from "./CandidateList";
import CandidateProfile from "./CandidateProfile";
import RecruiterDashboard from "./RecruiterDashboard";
import { BarChart2, Home, LogOut, PlusCircle, Users } from "lucide-react";


interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar links with paths
  const sidebarLinks = [
    { label: "Dashboard", icon: <Home className="w-5 h-5 mr-3" />, path: "/" },
     { label: "Candidates", icon: <Users className="w-5 h-5 mr-3" />, path: "/candidates" },
    { label: "Add Candidate", icon: <PlusCircle className="w-5 h-5 mr-3" />, path: "/create-candidate" },
    //  { label: "Configure Interview", icon: <ClipboardList className="w-5 h-5 mr-3" />, path: "/configure-interview" },
    { label: "Reports & Feedback", icon: <BarChart2 className="w-5 h-5 mr-3" />, path: "/reports" },
    // { label: "Settings", icon: <Settings className="w-5 h-5 mr-3" />, path: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div
          className="p-6 text-xl font-bold text-indigo-600 cursor-pointer hover:bg-indigo-50"
          onClick={() => navigate("/")}
        >
          AcePanel
        </div>
        <nav className="mt-6 flex-1 space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center w-full px-4 py-2 text-gray-700 rounded-lg transition-colors ${isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
              >
                {link.icon} {link.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center px-4 py-2 text-white bg-indigo-600 m-4 rounded-lg hover:bg-indigo-700"
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};





const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Home / Recruiter Dashboard */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              role === "recruiter" ? (
                <PageLayout>
                  <RecruiterDashboard />
                </PageLayout>
              ) : (
                <></>
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Candidate List */}
        <Route
          path="/candidates"
          element={
            isLoggedIn && role === "recruiter" ? (
              <PageLayout>
                <CandidateList />
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Add Candidate */}
        <Route
          path="/create-candidate"
          element={
            isLoggedIn && role === "recruiter" ? (
              <PageLayout>
                <CandidateProfile/>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Edit Candidate */}
        <Route
          path="/edit-candidate/:id"
          element={
            isLoggedIn && localStorage.getItem("role") === "recruiter" ? (
              <PageLayout>
                <CandidateProfile/>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

    </Router>
  );
};

export default App;
