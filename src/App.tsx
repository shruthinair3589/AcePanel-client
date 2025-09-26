import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./Login";
import CandidateList from "./CandidateList";
import CandidateProfile from "./CandidateProfile";
import RecruiterDashboard from "./RecruiterDashboard";
import ScheduleInterview from "./ScheduleInterview";
import PageLayout from "./PageLayout";
import InterviewList from "./InterviewList";
import CandidateDashboard from "./CandidateDasboard";

// Reusable wrapper for page animations
const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC<{
  isLoggedIn: boolean;
  role: string | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ isLoggedIn, role, setIsLoggedIn, setRole }) => {
  const isRecruiter = role === "recruiter";
  const isCandidate = role === "candidate";
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Common Login */}
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            </AnimatedPage>
          }
        />

        {/* Candidate Login via special link */}
        <Route
          path="/candidate-login"
          element={
            <AnimatedPage>
              <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            </AnimatedPage>
          }
        />

        {/* Recruiter Protected Routes */}
        <Route
          path="/"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <RecruiterDashboard />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/candidates"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <CandidateList />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/create-candidate"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <CandidateProfile />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/edit-candidate/:id"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <CandidateProfile />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/schedule-interview/:candidateId?"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <ScheduleInterview />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/interviews"
          element={
            isLoggedIn && isRecruiter ? (
              <PageLayout>
                <AnimatedPage>
                  <InterviewList />
                </AnimatedPage>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Candidate Protected Routes */}
        <Route
          path="/candidate-dashboard"
          element={
            isLoggedIn && isCandidate ? (
                <AnimatedPage>
                  <CandidateDashboard />
                </AnimatedPage>
            ) : (
              <Navigate to="/candidate-login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <Router>
      <AppRoutes
        isLoggedIn={isLoggedIn}
        role={role}
        setIsLoggedIn={setIsLoggedIn}
        setRole={setRole}
      />
    </Router>
  );
};

export default App;
