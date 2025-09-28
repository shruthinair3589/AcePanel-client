import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // ensures app state resets
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-gray-700 mb-6">
          Your interview has been successfully completed. We appreciate your time and effort. 
          The recruitment team will review your performance and get back to you with feedback shortly.
        </p>
        <p className="text-gray-600 mb-6 italic">
          Wishing you the best for your application!
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
