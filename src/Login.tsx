import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<"recruiter" | "candidate">("recruiter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const payload = { name, email, password, role };
        await API.post("/register", payload);
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        const payload = { email, password, role };
        await API.post("/login", payload);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);
        navigate("/");
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error occurred");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/Ofc.png')",
      }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md transform scale-105">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6">
          AcePanel
        </h1>

        {/* Role Tabs */}
        <div className="flex justify-center mb-6 bg-gray-200 bg-opacity-50 rounded-xl overflow-hidden">
          {["recruiter", "candidate"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r as "recruiter" | "candidate")}
              className={`flex-1 py-2 font-medium text-gray-700 transition-colors ${
                role === r
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-indigo-100 text-gray-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          {isRegister
            ? `${role.charAt(0).toUpperCase() + role.slice(1)} Registration`
            : `${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-4 rounded-xl font-semibold hover:bg-indigo-600 transition shadow-lg"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-indigo-500 font-medium cursor-pointer hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
