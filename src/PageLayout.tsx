// PageLayout.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BarChart2, Calendar, Home, LogOut, Menu, PlusCircle, Users, Video } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarLinks = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/" },
    { label: "Candidates", icon: <Users className="w-5 h-5" />, path: "/candidates" },
    { label: "Add Candidate", icon: <PlusCircle className="w-5 h-5" />, path: "/create-candidate" },
    { label: "Schedule", icon: <Calendar className="w-5 h-5" />, path: "/schedule-interview" },
    { label: "Interviews", icon: <Video className="w-5 h-5" />, path: "/interviews" },
    { label: "Reports & Feedback", icon: <BarChart2 className="w-5 h-5" />, path: "/reports" }, // Optional
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // Ensures App state resets
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 text-indigo-600 hover:bg-indigo-50 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {!collapsed && <span className="text-xl font-bold">AcePanel</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex-1 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className={`flex items-center w-full px-4 py-2 text-gray-700 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "hover:bg-indigo-100 hover:text-indigo-600"
                }`}
              >
                {link.icon}
                {!collapsed && <span className="ml-3">{link.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center px-4 py-2 text-white bg-indigo-600 m-4 rounded-lg hover:bg-indigo-700 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 transition-all">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
