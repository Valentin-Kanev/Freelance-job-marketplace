import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobManagement from "./components/jobs/JobsManagment";
import JobDashboard from "./components/jobs/JobDashboard";
import ProtectedRoute from "./components/Protectedroute";
import Header from "./components/UI/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileContainer } from "./components/profile/ProfileContainer";
import AuthMode from "./components/userAuthentication/AuthMode";
import { ToastProvider } from "./components/ToastManager";
import { useJobs } from "./hooks/useJobs";
import FreelancerProfilesList from "./components/profile/ProfilesList";
import ProfileDetails from "./components/profile/ProfileDetails";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <Header />
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { userId } = useAuth();
  const safeUserId = userId ?? null;

  // Fetch jobs and loading/error state
  const { data: jobs, isLoading, isError, error } = useJobs();

  return (
    <Routes>
      {/* Authentication */}
      <Route path="/auth" element={<AuthMode />} />
      {/* Jobs */}
      <Route path="/jobs" element={<JobManagement />} />
      <Route
        path="/jobs/:id"
        element={
          <JobDashboard
            jobs={jobs || []}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        }
      />
      <Route path="/profiles" element={<FreelancerProfilesList />} />
      <Route path="/profiles/:user_id" element={<ProfileDetails />} />
      <Route
        path="/profile-management"
        element={
          <ProtectedRoute>
            {safeUserId ? (
              <ProfileContainer userId={safeUserId} />
            ) : (
              <div>Please log in to view your profile.</div>
            )}
          </ProtectedRoute>
        }
      />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      {/* Fallback for unmatched routes */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};

export default App;
