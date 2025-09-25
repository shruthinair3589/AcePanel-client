import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./api";

interface CandidateProfileProps { }

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const CandidateProfile: React.FC<CandidateProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast helper
  const addToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  // Pre-fill if edit mode
  useEffect(() => {
    if (isEdit && id) {
      API.get(`/get-candidate/${id}`)
        .then((res) => {
          const data = res.data;
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setDesignation(data.position || "");
          setExperience(data.experience_years || "");
          setTechStack(data.technology || []);
        })
        .catch((err) => addToast("Failed to load candidate data", "error"));
    }
  }, [id, isEdit]);

  const handleResumeUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setDesignation(data.designation || "");
      setExperience(data.years_of_experience || "");
      setTechStack(data.technical_skills || []);
      addToast("Resume parsed successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to extract details from resume.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      handleResumeUpload(file);
    }
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !techStack.includes(skill)) {
      setTechStack([...techStack, skill]);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechStack(techStack.filter((s) => s !== skillToRemove));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setDesignation("");
    setExperience("");
    setTechStack([]);
    setResumeFile(null);
    setNewSkill("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clears the file input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("position", designation);
    formData.append("experience_years", String(experience));
    formData.append("technology", techStack.join(","));
    if (resumeFile) formData.append("resume_file", resumeFile);

    try {
      if (isEdit && id) {
        await API.put(`/edit-candidate/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // addToast("Candidate updated successfully!", "success");
      } else {
        await API.post("/create-candidate", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        //  addToast("Candidate added successfully!", "success");
      }

      setShowModal(true);
    } catch (err: any) {
      console.error(err);
      addToast(err.response?.data?.detail || "Error saving candidate", "error");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600">
        {isEdit ? "Edit Candidate" : "Add Candidate"}
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Upload Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          ref={fileInputRef} // attach ref here
        />
        {loading && <p className="text-gray-500 mt-2">Extracting details...</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Years of Experience"
          value={experience}
          onChange={(e) => setExperience(Number(e.target.value))}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        <div>
          <label className="block mb-2 font-medium">Technical Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {techStack.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:bg-indigo-200 transition"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-600 hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
        >
          {isEdit ? "Update Candidate" : "Add Candidate"}
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 font-semibold text-gray-700">
              Candidate saved successfully! Do you want to add another?
            </p>
            <div className="flex justify-around gap-4">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Yes
              </button>
              <button
                onClick={() => navigate("/candidates")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-5 right-5 flex flex-col gap-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-lg text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateProfile;
