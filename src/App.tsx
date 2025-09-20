import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./Login";
import HomePage from "./HomePage";
import CandidateList from "./CandidateList";
import CandidateProfile from "./CandidateProfile";

// Layout wrapper for pages with back button & breadcrumb
const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map of route paths to readable labels
  const breadcrumbs: Record<string, string> = {
    "/": "Home",
    "/select-candidate": "Select Candidate",
    "/create-candidate": "Add Candidate",
  };

  const currentLabel = breadcrumbs[location.pathname] || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show top bar except for login */}
      {location.pathname !== "/login" && (
        <div className="bg-white shadow p-4 flex items-center space-x-4">
          {location.pathname !== "/" && (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          <span className="text-gray-800 font-semibold">{currentLabel}</span>
        </div>
      )}

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
};

const App: React.FC = () => {
  const isLoggedIn = !!sessionStorage.getItem("isLoggedIn");

  return (
    <Router>
      <Routes>
        {/* Login page, no layout */}
        <Route path="/login" element={<Login />} />

        {/* Home page, optionally without back button */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <HomePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Candidate list */}
        <Route
          path="/select-candidate"
          element={
            isLoggedIn ? (
              <PageLayout>
                <CandidateList />
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Candidate profile / create */}
        <Route
          path="/create-candidate"
          element={
            isLoggedIn ? (
              <PageLayout>
                <CandidateProfile />
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
