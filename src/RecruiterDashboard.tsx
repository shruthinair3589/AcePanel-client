import React, { useEffect, useState } from "react";
import {
    LogOut,
    Download,
    Calendar,
    BarChart2,
    PlusCircle,
    Users,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

interface Interview {
    id: number;
    candidate_name: string;
    scheduled_at: string;
    status: string;
}
export const statusBadgeColors: Record<string, string> = {
    Scheduled: "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
};
const RecruiterDashboard: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all candidates
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

    // Fetch upcoming interviews (next 7 days)
    const fetchUpcomingInterviews = async () => {
        try {
            const res = await API.get("/get-all-candidates"); // Using candidates to fetch interviews per candidate
            let interviews: Interview[] = [];
            for (const c of res.data) {
                const ivs = await API.get(`/candidate/${c.id}/interviews`);
                ivs.data.forEach((i: any) => {
                    const scheduledDate = new Date(i.scheduled_at);
                    const now = new Date();
                    const nextWeek = new Date();
                    nextWeek.setDate(now.getDate() + 7);
                    if (scheduledDate >= now && scheduledDate <= nextWeek) {
                        interviews.push({
                            id: i.id,
                            candidate_name: c.name,
                            scheduled_at: i.scheduled_at,
                            status: i.status,
                        });
                    }
                });
            }
            setUpcomingInterviews(interviews.sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()));
        } catch (err) {
            console.error("Error fetching interviews:", err);
        }
    };

    useEffect(() => {
        fetchCandidates();
        fetchUpcomingInterviews();
    }, []);

    const handleDownload = (id: number) => {
        window.open(`${API.defaults.baseURL}/download-resume/${id}`, "_blank");
    };

    // Latest 5 candidates
    const latestCandidates = candidates.slice(0, 5);

    // Top 5 technologies
    const techCounts: Record<string, number> = {};
    candidates.forEach(c => {
        c.technology.forEach(tech => {
            techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
    });
    const techData = Object.entries(techCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

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

            {/* Quick Actions */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div
                    onClick={() => navigate("/create-candidate")}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border rounded-xl cursor-pointer hover:shadow transition"
                >
                    <PlusCircle size={28} className="text-indigo-600 mb-2" />
                    <span className="font-medium text-gray-700">Add Candidate</span>
                    <span className="text-xs text-gray-500 mt-1">Register new profile</span>
                </div>
                <div
                    onClick={() => navigate("/candidates")}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border rounded-xl cursor-pointer hover:shadow transition"
                >
                    <Users size={28} className="text-blue-600 mb-2" />
                    <span className="font-medium text-gray-700">View Candidates</span>
                    <span className="text-xs text-gray-500 mt-1">Browse profiles</span>
                </div>
                <div
                    onClick={() => navigate("/schedule-interview")}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 border rounded-xl cursor-pointer hover:shadow transition"
                >
                    <Calendar size={28} className="text-green-600 mb-2" />
                    <span className="font-medium text-gray-700">Schedule</span>
                    <span className="text-xs text-gray-500 mt-1">Plan interviews</span>
                </div>
                <div
                    onClick={() => navigate("/reports")}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 border rounded-xl cursor-pointer hover:shadow transition"
                >
                    <BarChart2 size={28} className="text-purple-600 mb-2" />
                    <span className="font-medium text-gray-700">Review Results</span>
                    <span className="text-xs text-gray-500 mt-1">Check outcomes</span>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Top Technologies */}
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

                {/* Latest Candidates */}
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-gray-700 font-semibold mb-3">Latest Candidates</h3>
                    {loading ? (
                        <p>Loading candidates...</p>
                    ) : latestCandidates.length === 0 ? (
                        <p>No candidates found.</p>
                    ) : (
                        <div className="space-y-4">
                            {latestCandidates.map((c) => (
                                <div key={c.id} className="border p-3 rounded-lg">
                                    <p className="font-semibold text-gray-700">{c.name}</p>
                                    <p className="text-sm text-gray-500">{c.position}</p>
                                    <p className="text-sm text-gray-500">{c.experience_years} yrs experience</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {c.technology.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">{tech}</span>
                                        ))}
                                        {c.technology.length > 3 && (
                                            <span title={c.technology.slice(3).join(", ")} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full cursor-pointer">
                                                +{c.technology.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-gray-50 p-6 rounded-xl shadow mb-8">
                <h3 className="text-gray-700 font-semibold mb-4">Upcoming Interviews (Next 7 Days)</h3>
                {upcomingInterviews.length === 0 ? (
                    <p className="text-gray-500 text-sm">No interviews scheduled.</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingInterviews.map((i) => (
                            <div key={i.id} className="p-3 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-700">{i.candidate_name}</p>
                                    <p className="text-sm text-gray-500">{new Date(i.scheduled_at).toLocaleString()}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${statusBadgeColors[i.status] || "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {i.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
