import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunchInterview = () => {
    navigate("/select-candidate");
  };

  const handleAddCandidate = () => {
    navigate("/create-candidate");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/Ofc.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Semi-transparent centered card */}
      <div className="bg-white/90 backdrop-blur-md p-12 rounded-3xl flex flex-col items-center space-y-6 shadow-2xl max-w-lg w-full border border-gray-100">
        {/* App Name */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700">AcePanel</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Your Interview Dashboard
          </p>
        </div>

        {/* Buttons */}
        <button
          onClick={handleLaunchInterview}
          className="w-full px-12 py-5 bg-indigo-600 text-white text-2xl font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition transform hover:scale-105"
        >
          🚀 Launch Interview
        </button>

        <button
          onClick={handleAddCandidate}
          className="w-full px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition"
        >
          + Add Candidate
        </button>
      </div>
    </div>
  );
};

export default HomePage;
