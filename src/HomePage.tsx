import React from "react";
import RecruiterDashboard from "./RecruiterDashboard";
//import CandidateDashboard from "./CandidateDashboard";

const HomePage: React.FC = () => {
  const role = localStorage.getItem("role");

  if (role === "recruiter") {
    return <RecruiterDashboard />;
  } 
  // else if (role === "candidate") {
  //   return <CandidateDashboard />;
  // } 
  else {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-xl">Please login to continue.</p>
      </div>
    );
  }
};

export default HomePage;
