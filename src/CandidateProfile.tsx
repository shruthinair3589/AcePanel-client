import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

const CandidateProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [years, setYears] = useState(0);
  const [technology, setTechnology] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const techList = technology.split(",").map((t) => t.trim());
      const res = await API.post("/create-candidate", {
        name,
        email,
        position,
        years_of_experience: years,
        technology: techList,
      });
      alert("Candidate created: " + res.data.name);
      // Reset form
      setName("");
      setEmail("");
      setPosition("");
      setYears(0);
      setTechnology("");
      // Optionally navigate back to Candidate List
      navigate("/select-candidate");
    } catch (err) {
      console.error(err);
      alert("Error creating candidate");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md space-y-6"
      >
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Add Candidate
        </h2>

        {/* Full Name */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder=" "
            className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <label className="absolute left-4 top-1 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-indigo-500">
            Full Name
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder=" "
            className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <label className="absolute left-4 top-1 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-indigo-500">
            Email
          </label>
        </div>

        {/* Position */}
        <div className="relative">
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            placeholder=" "
            className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <label className="absolute left-4 top-1 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-indigo-500">
            Position
          </label>
        </div>

        {/* Years of Experience */}
        <div className="relative">
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value))}
            required
            placeholder=" "
            className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <label className="absolute left-4 top-1 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-indigo-500">
            Years of Experience
          </label>
        </div>

        {/* Technologies */}
        <div className="relative">
          <input
            type="text"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder=" "
            className="peer w-full p-4 pt-6 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <label className="absolute left-4 top-1 text-gray-400 text-sm transition-all
            peer-placeholder-shown:top-4
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-400
            peer-focus:top-1
            peer-focus:text-sm
            peer-focus:text-indigo-500">
            Technologies (comma separated)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-indigo-500 text-white rounded-full font-semibold hover:bg-indigo-600 transition-all shadow-md"
        >
          Create Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateProfile;
