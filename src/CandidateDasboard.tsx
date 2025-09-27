import React, { useEffect, useState } from "react";
import { Disc, Mic, Video, Bot, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "./api";

interface InterviewDetails {
  id: number,
  candidate_id: number,
  candidate_name: string,
  candidate_email: string,
  scheduled_at: string,
  technology: string[],
  position: string,
  experience_years: number,
}

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const interviewId = localStorage.getItem("interviewId");
  const candidateId = localStorage.getItem("candidateId");
  const email = localStorage.getItem("candidateEmail") || "";
  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!interviewId) return;
    API.get(`/interview/${interviewId}`)
      .then((res) => setInterviewDetails(res.data))
      .catch(() => alert("Failed to fetch candidate details"))
      .finally(() => setLoading(false));
  }, [interviewId]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const launchInterview = () => closeModal();

  const logout = () => {
    localStorage.clear();
    navigate(`/login?role=candidate&email=${email}&candidate_id=${candidateId}&interview_id=${interviewId}`);
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="relative min-h-screen">
      {/* Dark blurred background */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white/95 rounded-3xl shadow-2xl max-w-lg w-full p-10 space-y-8 text-gray-700">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-indigo-600">Interview Checklist</h1>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-red-500 font-semibold hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="leading-none">Logout</span>
            </button>
          </div>

          {/* Candidate Details Card */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 rounded-xl space-y-2">
            <p className="font-semibold text-indigo-700 text-lg">Confirm Your Details</p>
            <div className="space-y-1 text-gray-700">
              <p><strong>Name:</strong> {interviewDetails?.candidate_name}</p>
              <p><strong>Position:</strong> {interviewDetails?.position}</p>
              <p><strong>Experience:</strong> {interviewDetails?.experience_years} years</p>
            </div>
          </div>

          {/* Technologies to be Assessed */}
          <div>
            <p className="font-semibold text-indigo-700 text-lg mb-2">Technologies to be Assessed</p>
            <div className="flex flex-wrap gap-2">
              {interviewDetails?.technology.map((tech) => (
                <span
                  key={tech}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium select-none"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>


          {/* Checklist Section */}
          <div>
            <p className="font-semibold text-indigo-700 text-lg mb-2">Before You Start</p>
            <ul className="flex flex-col gap-3">
              {[
                { icon: <Disc color="#EF4444" size={20} />, text: "This interview will be recorded (video & audio)" },
                { icon: <Bot color="#4F46E5" size={20} />, text: "Interview fully conducted by AI" },
                { icon: <Mic color="#16A34A" size={20} />, text: "Ensure a working microphone" },
                { icon: <Video color="#2563EB" size={20} />, text: "Ensure a working webcam" },
                { icon: <span className="text-gray-500 text-xl">💡</span>, text: "Stable internet & quiet, well-lit environment" },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Launch Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-2xl py-4 px-12 rounded-3xl shadow-lg hover:scale-105 transition-transform"
            >
              Launch Interview
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-95 opacity-0 animate-scaleIn">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <Bot size={24} /> Confirm Launch
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-700 mt-4 mb-6">
              Please ensure all your details are correct before starting. The session will be recorded.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={launchInterview}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition-transform"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes scaleIn {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scaleIn {
            animation: scaleIn 0.2s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default CandidateDashboard;
