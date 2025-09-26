import React, { useEffect, useState } from "react";
import API from "./api";
import { useNavigate, useSearchParams } from "react-router-dom";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setRole }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setLocalRole] = useState<"recruiter" | "candidate">("recruiter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [forceRegister, setForceRegister] = useState(false); // disable toggle

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Detect join link or prefill email
  useEffect(() => {
    const roleFromLink = searchParams.get("role");
    const candidateEmail = searchParams.get("email");
    const candidateIdFromLink = searchParams.get("candidate_id");
    const interviewIdFromLink = searchParams.get("interview_id");

    if (roleFromLink === "candidate") {
      setLocalRole("candidate");
      setIsRegister(true);
      setForceRegister(true); // candidate cannot toggle

      if (candidateEmail) {
        setEmail(candidateEmail);
        setEmailDisabled(true);
      }
      if (candidateIdFromLink) setCandidateId(candidateIdFromLink);
      if (interviewIdFromLink) setInterviewId(interviewIdFromLink);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const payload = {
          name: role === "candidate" ? "" : name,
          email,
          password,
          role,
        };
        await API.post("/register", payload);

        alert("Registration successful!");

        // Candidate via join link: redirect to login (pre-filled)
        if (role === "candidate" && candidateId && interviewId) {
          setIsRegister(false);
          return navigate(
            `/login?role=candidate&email=${email}&candidate_id=${candidateId}&interview_id=${interviewId}`
          );
        }

        // Recruiter: switch to login
        if (role === "recruiter") {
          setIsRegister(false);
        }
      } else {
        // Login flow
        const payload = { email, password, role };
        await API.post("/login", payload);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);

        setIsLoggedIn(true);
        setRole(role);

        // Redirect logic
        if (role === "candidate") {
          // Store candidate details for dashboard
          if (candidateId) localStorage.setItem("candidateId", candidateId);
          if (interviewId) localStorage.setItem("interviewId", interviewId);
          localStorage.setItem("candidateEmail", email);

          navigate("/candidate-dashboard"); // redirect to dashboard
        } else {
          navigate("/"); // recruiter dashboard/home
        }
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const status = err.response?.status;

      // Handle "Email already registered"
      if (status === 400 && detail === "Email already registered") {
        setToastMessage("Email already registered. Redirecting to login...");
        setShowToast(true);
        setTimeout(() => {
          setIsRegister(false); // switch to login form
          setShowToast(false);
          if (role === "candidate" && candidateId && interviewId) {
            navigate(
              `/login?role=candidate&email=${email}&candidate_id=${candidateId}&interview_id=${interviewId}`
            );
          }
        }, 2000); // show toast for 2 seconds
      } else {
        alert(detail || "Error occurred during registration/login");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Ofc.png')" }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transform scale-105 relative">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6">
          AcePanel
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          {isRegister
            ? `${role.charAt(0).toUpperCase() + role.slice(1)} Registration`
            : `${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
        </h2>

        {/* Toast */}
        {showToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out z-50">
            {toastMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Name field only for recruiter registration */}
          {isRegister && role === "recruiter" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
            />
          )}

          {/* Email field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={emailDisabled}
            className={`w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400 ${emailDisabled ? "bg-gray-100" : "bg-white"
              }`}
          />

          {/* Password field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-4 rounded-xl font-semibold hover:bg-indigo-600 transition shadow-lg"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Toggle link hidden if forceRegister */}
        {!forceRegister && (
          <p className="text-center text-gray-600 mt-6">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-indigo-500 font-medium cursor-pointer hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        )}
      </div>
      {/* Tailwind fade animation */}
      <style>
        {`
          @keyframes fade-in-out {
            0%,100% { opacity: 0; }
            10%,90% { opacity: 1; }
          }
          .animate-fade-in-out {
            animation: fade-in-out 2s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
