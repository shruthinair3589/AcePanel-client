import React, { useEffect, useState } from "react";
import { Disc, Mic, Video, Bot, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import { startAssistant, vapi, stopAssistant } from "./AI";
import ActiveCallDetails from "./call/ActiveCallDetails";

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  technology: string[];
  resume_stored: boolean;
}

const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const interviewId = localStorage.getItem("interviewId");
  const candidateId = localStorage.getItem("candidateId");
  const email = localStorage.getItem("candidateEmail") || "";
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCallUI, setShowCallUI] = useState(false);
  const [started, setStarted] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callId, setCallId] = useState<string | undefined>("");
  const [callResult, setCallResult] = useState<any | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);
  const [transcripts, setTranscripts] = useState< {role: string; text: string }[]>([]);
  
  useEffect(() => {
    if (!candidateId) return;
    API.get(`/get-candidate/${candidateId}`)
      .then((res) => setCandidate(res.data))
      .catch(() => alert("Failed to fetch candidate details"))
      .finally(() => setLoading(false));
  }, [candidateId]);

  useEffect(() => {
    if(started){
    vapi
      .on("call-start", () => {
        setCallLoading(false);
        setStarted(true);
      })
      .on("call-end", () => {
        setStarted(false);
        setCallLoading(false);
      })
      .on("speech-start", () => {
        setAssistantIsSpeaking(true);
      })
      .on("speech-end", () => {
        setAssistantIsSpeaking(false);
      })
      .on("volume-level", (level) => {
        setVolumeLevel(level);
      })
      .on("message", (message) => {
        if (message.type === "transcript") {
           setTranscripts((prev: any) => [
            ...prev,
          { role: message.role, text: message.transcript }
        ]);
         
          if (callId) {
            fetch("http://localhost:8000/save-transcript", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                call_id: callId,
                role: message.role,
                transcript: message.transcript,
              }),
            })
              .then((res) => res.json())
              .then((data) => console.log("Transcript saved:", data))
              .catch((err) => console.error("Error saving transcript:", err));
          }
        }
      })
    }
  }, [started, callId]);

    const handleStop = () => {
    stopAssistant();
    getCallDetails();
  };

const getCallDetails = (interval = 3000) => {
  setLoadingResult(true);
  console.log("calling the function from FE")
  fetch(`http://localhost:8000/call-details?call_id=${callId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.analysis && data.summary) {
          console.log(data);
          setCallResult(data);
          setLoadingResult(false);
        } else {
          setTimeout(() => getCallDetails(interval), interval);
        }
      })
      .catch((error) => alert(error));
  };


const openModal = () => setShowModal(true);
const closeModal = () => setShowModal(false);

const launchInterview = async () => {
    console.log("candidate", candidate)
    setStarted(true);
    const name = candidate?.name;
    const position = candidate?.position;
    const yearsOfExp = candidate?.experience_years;
    const technology = candidate?.technology;
    closeModal();
    setShowCallUI(true);
    const data = await startAssistant(name, position, yearsOfExp, technology);
    console.log("data", data)
    setCallId(data?.id);
    // if (!interviewId || !candidateId) {
    //   alert("Interview info missing. Please contact support.");
    //   return;
    // }
    // const interviewUrl = `https://vapi.ai/start?candidate_id=${candidateId}&interview_id=${interviewId}`;
    // window.open(interviewUrl, "_blank");
    
  };

  const logout = () => {
    localStorage.clear();
    navigate(`/login?role=candidate&email=${email}&candidate_id=${candidateId}&interview_id=${interviewId}`);
  };

  if (loading) return <div className="p-10 text-center text-gray-600">Loading...</div>;

return (
   <>
    { 
    showCallUI ? (
      <>
        {/* Call Result */}
        {!loadingResult && callResult && (
          <div className="mt-6 p-6 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">📋 Call Result</h3>
            <p className="mb-2">
              <span className="font-medium text-gray-300">Qualified:</span>{" "}
              <span
                className={`font-bold ${
                  callResult.analysis.structuredData.is_qualified
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {callResult.analysis.structuredData.is_qualified ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-gray-200 leading-relaxed">{callResult.summary}</p>
          </div>
        )}

        {/* Loading State */}
        {(callLoading || loadingResult) && (
          <div className="mt-6 flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-blue-400 animate-pulse">
              ⏳ Fetching call summary...
            </h2>
          </div>
        )}

        {/* Active Call */}
        {started && (
          <ActiveCallDetails
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            endCallCallback={handleStop}
            callId={callId}
            setCallLoading={setCallLoading}
          />
        )}
      </>
) : (<>
      <div className="relative min-h-screen">
      {/* Dark blurred background */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* Main dashboard */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 space-y-8 text-gray-700">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-indigo-600">Interview Checklist</h1>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-red-500 font-semibold hover:text-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="leading-none">Logout</span>
            </button>
          </div>


          {/* Candidate Details */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 rounded-xl space-y-3">
            <p className="font-semibold text-indigo-700 text-lg">Confirm your details:</p>
            <div className="space-y-1 text-gray-700">
              <p><strong>Name:</strong> {candidate?.name}</p>
              <p><strong>Position:</strong> {candidate?.position}</p>
              <p><strong>Experience:</strong> {candidate?.experience_years} years</p>
              <p><strong>Technical Skills:</strong> {candidate?.technology.join(", ")}</p>
            </div>
          </div>

          {/* Modern Checklist */}
          <div className="space-y-3">
            <p className="font-semibold text-indigo-700 text-lg">Before you start:</p>
            <ul className="flex flex-col gap-2">
              {[
                { icon: <Disc color="#EF4444" size={20} />, text: "This interview will be recorded (video & audio)" },
                { icon: <Bot color="#4F46E5" size={20} />, text: "Interview is fully conducted by AI" },
                { icon: <Mic color="#16A34A" size={20} />, text: "Ensure a working microphone" },
                { icon: <Video color="#2563EB" size={20} />, text: "Ensure a working webcam" },
                { icon: <span className="text-gray-500 text-xl">💡</span>, text: "Stable internet and a quiet, well-lit environment" },
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
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-2xl py-5 px-12 rounded-3xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              Launch Interview
            </button>
          </div>
        </div>
      </div>

      {/* Professional Confirmation Modal */}
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
              Please ensure all your details are correct before starting the interview.
              Once started, the session will be recorded.
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
      </>)
    }
  </>
  );
};

export default CandidateDashboard;
