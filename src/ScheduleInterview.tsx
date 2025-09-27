import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./api";
import { v4 as uuidv4 } from "uuid";
import { Calendar, Check, Plus, Search } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  experience_years: number;
  technology: string[];
}

interface Toast {
  id: string;
  message: string;
  type: "info" | "error";
}

const ScheduleInterview: React.FC = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchText, setSearchText] = useState("");

  const [allTechs, setAllTechs] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helper
  const addToast = (message: string, type: "info" | "error") => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch candidates
  const fetchCandidates = async () => {
    try {
      const res = await API.get("/get-all-candidates");
      setCandidates(res.data);
      if (candidateId) {
        const candidate = res.data.find((c: Candidate) => c.id === parseInt(candidateId));
        if (candidate) {
          setSelectedCandidate(candidate);
          setAllTechs(candidate.technology);
          setSelectedTechs(candidate.technology);
        }
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      addToast("Failed to load candidates", "error");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [candidateId]);

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const addTech = () => {
    const techTrimmed = newTech.trim();
    if (!techTrimmed) return;
    if (!allTechs.includes(techTrimmed)) setAllTechs([...allTechs, techTrimmed]);
    if (!selectedTechs.includes(techTrimmed)) setSelectedTechs([...selectedTechs, techTrimmed]);
    setNewTech("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  const handleSubmit = async () => {
    if (!selectedCandidate) {
      addToast("Please select a candidate", "error");
      return;
    }
    if (!scheduledAt) {
      addToast("Please select date and time", "error");
      return;
    }

    setIsScheduling(true);
    addToast("Sending email to candidate...", "info");

    try {
      const callId = uuidv4();
      const payload = {
        candidate_id: selectedCandidate.id,
        scheduled_at: scheduledAt,
        technology: selectedTechs,
        call_id: callId,
      };
      await API.post("/schedule-interview", payload);

      // Navigate immediately after success
      setIsScheduling(false);
      navigate("/interviews");
    } catch (err) {
      console.error(err);
      addToast("Failed to schedule interview", "error");
      setIsScheduling(false);
    }
  };

  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Schedule Technical Interview</h1>

      {!candidateId && (
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Select Candidate</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search candidate..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <div className="mt-2 border rounded-lg max-h-72 overflow-y-auto bg-white shadow">
            {candidates
              .filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))
              .map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCandidate(c);
                    setAllTechs(c.technology);
                    setSelectedTechs(c.technology);
                  }}
                  className={`p-3 cursor-pointer hover:bg-indigo-50 transition border-b last:border-b-0 ${selectedCandidate?.id === c.id ? "bg-indigo-100" : ""}`}
                >
                  <p className="font-medium text-gray-800">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.position}</p>
                  <p className="text-sm text-gray-500">{c.experience_years} yrs experience</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.technology.slice(0, 5).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">{tech}</span>
                    ))}
                    {c.technology.length > 5 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{c.technology.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            {candidates.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())).length === 0 && (
              <p className="p-3 text-gray-400 text-sm">No candidates found</p>
            )}
          </div>
        </div>
      )}

      {selectedCandidate && (
        <div className="mb-6 p-4 border-l-4 border-indigo-500 bg-white rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">{selectedCandidate.name}</p>
          <p className="text-sm text-gray-500">{selectedCandidate.position}</p>
          <p className="text-sm text-gray-500">{selectedCandidate.experience_years} yrs experience</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">Technologies</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {allTechs.map((tech) => (
            <span
              key={tech}
              onClick={() => toggleTech(tech)}
              className={`px-3 py-1 rounded-full cursor-pointer transition ${selectedTechs.includes(tech) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add technology and press Enter"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border px-3 py-2 rounded-lg flex-1"
          />
          <button
            onClick={addTech}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">Schedule Date & Time</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          min={minDateTime}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isScheduling}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white ${isScheduling ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        <Check size={18} /> {isScheduling ? "Scheduling..." : "Schedule Interview"}
      </button>

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-sm ${t.type === "info" ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleInterview;
