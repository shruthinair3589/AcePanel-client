import React, { useEffect, useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Download, Calendar, FileText } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  technology: string[];
  resume_stored: boolean;
  status?: string; // Optional extra status text
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>({});

  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/get-all-candidates");
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/delete-candidate/${id}`);
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      setDeleteCandidateId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = (id: number) => {
    window.open(`${API.defaults.baseURL}/download-resume/${id}`, "_blank");
  };

  const toggleSkills = (id: number) => {
    setExpandedSkills((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.position.toLowerCase().includes(search.toLowerCase()) ||
      c.technology.some((tech) => tech.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Candidates</h2>
      <input
        type="text"
        placeholder="Search by name, email, position, or tech..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
      />

      {loading ? (
        <p className="text-gray-600">Loading candidates...</p>
      ) : filteredCandidates.length === 0 ? (
        <p className="text-gray-600">No candidates found.</p>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((c) => {
            const interviewScheduled = c.id % 2 === 0; // demo
            const isExpanded = expandedSkills[c.id] || false;

            const initialTech = c.technology.slice(0, 4);
            const extraTech = c.technology.slice(4);

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Candidate Info */}
                <div className="p-6">
                  {/* Name + Status Badge */}
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {c.name}
                    </h3>
                    <span
                      className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${
                        interviewScheduled
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {interviewScheduled ? "Scheduled" : "Not Scheduled"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{c.email}</p>
                  <p className="text-sm text-gray-600">{c.position}</p>
                  <p className="text-sm text-gray-600">
                    {c.experience_years} yrs experience
                  </p>

                  {/* Extra status text */}
                  {c.status && (
                    <p className="mt-2 text-sm font-medium text-indigo-700">
                      {c.status}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {initialTech.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}

                    {!isExpanded && extraTech.length > 0 && (
                      <button
                        onClick={() => toggleSkills(c.id)}
                        className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        +{extraTech.length} more
                      </button>
                    )}
                  </div>

                  {isExpanded && extraTech.length > 0 && (
                    <div className="mt-2 flex flex-wrap max-h-24 overflow-y-auto border-t border-gray-200 pt-2 gap-2">
                      {extraTech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      <button
                        onClick={() => toggleSkills(c.id)}
                        className="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        Collapse
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate(`/edit-candidate/${c.id}`)}
                    className="flex flex-col items-center justify-center w-16 py-2 text-gray-700 hover:text-indigo-600 transition"
                  >
                    <Edit size={18} />
                    <span className="text-xs mt-1">Edit</span>
                  </button>

                  {deleteCandidateId === c.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="flex flex-col items-center justify-center w-16 py-2 text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                        <span className="text-xs mt-1">Confirm</span>
                      </button>
                      <button
                        onClick={() => setDeleteCandidateId(null)}
                        className="flex flex-col items-center justify-center w-16 py-2 text-gray-500 hover:text-gray-700 transition"
                      >
                        ✕
                        <span className="text-xs mt-1">Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteCandidateId(c.id)}
                      className="flex flex-col items-center justify-center w-16 py-2 text-gray-700 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                      <span className="text-xs mt-1">Delete</span>
                    </button>
                  )}

                  {c.resume_stored && (
                    <button
                      onClick={() => handleDownload(c.id)}
                      className="flex flex-col items-center justify-center w-16 py-2 text-gray-700 hover:text-green-600 transition"
                    >
                      <Download size={18} />
                      <span className="text-xs mt-1">Resume</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/schedule-interview/${c.id}`)}
                    className="flex flex-col items-center justify-center w-16 py-2 text-gray-700 hover:text-purple-600 transition"
                  >
                    <Calendar size={18} />
                    <span className="text-xs mt-1">Schedule</span>
                  </button>

                  <button
                    onClick={() => navigate(`/feedback/${c.id}`)}
                    className="flex flex-col items-center justify-center w-16 py-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    <FileText size={18} />
                    <span className="text-xs mt-1">Result</span>
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

export default CandidateList;
