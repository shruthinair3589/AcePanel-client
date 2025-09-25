import React, { useEffect, useState } from "react";
import {
  LogOut,
  Download,
  Calendar,
  BarChart2,
  PlusCircle,
  Users,
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API from "./api"; 
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  position: string;
  experience_years: number;
  technology: string[];
  resume_stored: boolean;
}

const RecruiterDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/get-all-candidates");
      setCandidates(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDownload = (id: number) => {
    window.open(`${API.defaults.baseURL}/download-resume/${id}`, "_blank");
  };

  const latestCandidates = candidates.slice(0, 5);

  // Demo pie chart for interview status
  const interviewData = [
    { name: "Scheduled", value: candidates.filter(c => c.id % 2 === 0).length },
    { name: "Pending", value: candidates.filter(c => c.id % 2 !== 0).length },
  ];
  const COLORS = ["#4ade80", "#facc15"];

  // Compute tech popularity (how many candidates know each tech)
  const techCounts: Record<string, number> = {};
  candidates.forEach(c => {
    c.technology.forEach(tech => {
      techCounts[tech] = (techCounts[tech] || 0) + 1;
    });
  });
  const techData = Object.entries(techCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count) // Sort descending
    .slice(0, 5); // Top 5 popular techs

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome, Recruiter 👋</h1>
        <button
          className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          onClick={() => { localStorage.clear(); navigate("/login"); }}
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>

      {/* Quick Actions Grid */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div
          onClick={() => navigate("/create-candidate")}
          className="flex flex-col items-center p-5 bg-white border rounded-xl cursor-pointer hover:shadow transition"
        >
          <PlusCircle size={28} className="text-indigo-600 mb-2" />
          <span className="font-medium text-gray-700">Add Candidate</span>
          <span className="text-xs text-gray-500 mt-1">Register new profile</span>
        </div>
        <div
          onClick={() => navigate("/candidates")}
          className="flex flex-col items-center p-5 bg-white border rounded-xl cursor-pointer hover:shadow transition"
        >
          <Users size={28} className="text-blue-600 mb-2" />
          <span className="font-medium text-gray-700">View Candidates</span>
          <span className="text-xs text-gray-500 mt-1">Browse profiles</span>
        </div>
        <div
          onClick={() => navigate("/schedule")}
          className="flex flex-col items-center p-5 bg-white border rounded-xl cursor-pointer hover:shadow transition"
        >
          <Calendar size={28} className="text-green-600 mb-2" />
          <span className="font-medium text-gray-700">Schedule</span>
          <span className="text-xs text-gray-500 mt-1">Plan interviews</span>
        </div>
        <div
          onClick={() => navigate("/reports")}
          className="flex flex-col items-center p-5 bg-white border rounded-xl cursor-pointer hover:shadow transition"
        >
          <BarChart2 size={28} className="text-purple-600 mb-2" />
          <span className="font-medium text-gray-700">Review Results</span>
          <span className="text-xs text-gray-500 mt-1">Check outcomes</span>
        </div>
      </div>

      {/* Stats with Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Interview Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-semibold mb-3">Interview Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={interviewData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {interviewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Technology Popularity Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-semibold mb-3">Top Technologies</h3>
          {techData.length === 0 ? (
            <p className="text-gray-500 text-sm">No tech data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={techData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Latest Candidates */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Latest Candidates</h2>
      {loading ? (
        <p>Loading candidates...</p>
      ) : latestCandidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestCandidates.map((c) => {
            const interviewScheduled = c.id % 2 === 0;
            return (
              <div key={c.id} className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-700">{c.name}</h2>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      interviewScheduled ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {interviewScheduled ? "Scheduled" : "Not Scheduled"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{c.position}</p>
                <p className="text-sm text-gray-500">{c.email}</p>
                <p className="text-sm text-gray-500">{c.experience_years} yrs experience</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {c.technology.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                      {tech}
                    </span>
                  ))}
                  {c.technology.length > 3 && (
                    <span
                      title={c.technology.slice(3).join(", ")}
                      className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full cursor-pointer"
                    >
                      +{c.technology.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-4 text-sm">
                  {c.resume_stored && (
                    <button onClick={() => handleDownload(c.id)} className="flex items-center gap-1 text-green-600 hover:text-green-800">
                      <Download size={16} /> Resume
                    </button>
                  )}
                  <button onClick={() => navigate(`/edit-candidate/${c.id}`)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                    <PlusCircle size={16} /> Edit
                  </button>
                  <button onClick={() => navigate(`/schedule-interview/${c.id}`)} className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                    <Calendar size={16} /> Schedule
                  </button>
                  <button onClick={() => navigate(`/reports`)} className="flex items-center gap-1 text-purple-600 hover:text-purple-800">
                    <BarChart2 size={16} /> Results
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
