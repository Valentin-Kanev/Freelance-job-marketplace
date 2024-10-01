import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfileManagement from "./components/ProfileManagment";
import JobManagement from "./components/Job";
import FreelancerReviews from "./components/FreelancerReviews";
import UserManagement from "./components/UserAuthentication";
import ProtectedRoute from "./components/Protectedroute";

export const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<UserManagement />} />{" "}
        {/* Login/Register */}
        <Route path="/jobs" element={<JobManagement />} />
        {/* Dynamic Route for freelancer profiles */}
        <Route path="/profiles/:id/reviews" element={<FreelancerReviews />} />
        {/* Protected Route */}
        <Route
          path="/profile-management"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileManagement />
            </ProtectedRoute>
          }
        />
        {/* Default route */}
        {/* Make the default route the authentication page */}
        <Route path="/" element={<h1>Welcome to the Job Portal</h1>} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
