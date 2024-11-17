import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import JobManagement from "./components/jobs/JobsManagment";
// import FreelancerReviews from "./components/FreelancerReviews";
import ProtectedRoute from "./components/Protectedroute";
import Header from "./components/UI/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import JobDetails from "./components/jobs/jobDetails/JobDetails";
import { ProfileContainer } from "./components/profile/ProfileContainer";
import AuthMode from "./components/userAuthentication/AuthMode";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <AppRoutes /> {/* Routes moved to a separate component */}
      </Router>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { userId } = useAuth();
  const safeUserId = userId ?? null;

  return (
    <Routes>
      <Route path="/auth" element={<AuthMode />} />
      <Route path="/jobs" element={<JobManagement />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      {/* <Route path="/profiles/:id/reviews" element={<FreelancerReviews />} /> */}
      <Route path="/profiles/:freelancerId" element={<ProfileContainer />} />
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
      <Route path="/" element={<Navigate to="/jobs" replace />} />
    </Routes>
  );
};

export default App;
