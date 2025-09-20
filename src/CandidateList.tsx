import React, { useEffect, useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  years_of_experience: number;
  technology: string[];
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Show 9 cards per page

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get("/get-all-candidates");
        setCandidates(res.data);
        setFilteredCandidates(res.data);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch candidates");
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.position.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCandidates(filtered);
    setCurrentPage(1); // Reset page on search
  }, [search, candidates]);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleStartInterview = () => {
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    if (!candidate) return;
    alert(`Launching interview for ${candidate.name}`);
  };

  const handleAddCandidate = () => {
    navigate("/create-candidate");
  };

  if (loading) return <div className="p-6 text-gray-700 text-center">Loading candidates...</div>;
  if (error) return <div className="p-6 text-red-500 text-center font-semibold">{error}</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">Candidates</h2>
        <button
          onClick={handleAddCandidate}
          className="px-6 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition"
        >
          + Add Candidate
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or position..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Candidates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {currentCandidates.map((c) => {
          const isSelected = selectedCandidateId === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCandidateId(c.id)}
              className={`p-6 bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer transition transform ${
                isSelected ? "ring-2 ring-indigo-500 scale-105" : ""
              }`}
            >
              <h3 className="text-xl font-bold text-indigo-600">{c.name}</h3>
              <p className="text-gray-600">{c.email}</p>
              <p className="text-gray-700 font-medium">{c.position}</p>
              <p className="text-gray-500">{c.years_of_experience} years experience</p>
              <p className="text-gray-500 mt-2">
                <span className="font-semibold">Tech:</span> {c.technology.join(", ")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-100 rounded hover:bg-indigo-200 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-100 rounded hover:bg-indigo-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Start Interview button */}
      {selectedCandidateId && (
        <button
          onClick={handleStartInterview}
          className="mt-6 px-12 py-4 bg-indigo-500 text-white rounded-3xl shadow-lg hover:bg-indigo-600 transition"
        >
          Start Interview
        </button>
      )}
    </div>
  );
};

export default CandidateList;
