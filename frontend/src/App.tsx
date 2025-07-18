import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobManagement from "./components/jobs/JobsManagment";
import JobListWithDetails from "./components/jobs/JobListWithDetails";
import ProtectedRoute from "./components/userAuthentication/Protectedroute";
import Header from "./components/UI/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileContainer } from "./components/profile/ProfileContainer";
import AuthMode from "./components/userAuthentication/AuthMode";
import { ToastProvider } from "./contexts/ToastManager";
import FreelancerProfilesList from "./components/profile/FreelancerProfilesList";
import ProfileLoader from "./components/profile/ProfileLoader";
import { SocketProvider } from "./contexts/SocketContext";
import ChatContainer from "./components/chat/ChatContainer";
import { ChatProvider } from "./contexts/ChatContext";
import { ChatButtonWrapper } from "./components/chat/ChatButtonWrapper";
import { useJobs } from "./hooks/jobs/useJobs";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-grow p-4">{children}</main>
        <ChatButtonWrapper />
      </div>
    </div>
  );
};

const ProfileWithUserId = () => {
  const { loggedInUserId } = useAuth();
  return loggedInUserId ? (
    <ProfileContainer userId={loggedInUserId} />
  ) : (
    <div>Please log in to view your profile.</div>
  );
};

const JobDetailsWrapper = () => {
  const { data: jobs, isLoading, isError, error } = useJobs();
  return (
    <JobListWithDetails
      jobs={jobs || []}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <ToastProvider>
            <SocketProvider>
              <Layout>
                <Routes>
                  <Route path="/auth/login" element={<AuthMode />} />
                  <Route path="/auth/register" element={<AuthMode />} />
                  <Route path="/jobs" element={<JobManagement />} />
                  <Route path="/jobs/:jobId" element={<JobDetailsWrapper />} />
                  <Route
                    path="/profiles"
                    element={<FreelancerProfilesList />}
                  />
                  <Route path="/profiles/:userId" element={<ProfileLoader />} />
                  <Route
                    path="/profile-management"
                    element={
                      <ProtectedRoute>
                        <ProfileWithUserId />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <ChatContainer />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/jobs" replace />} />
                  <Route path="*" element={<div>Page not found</div>} />
                </Routes>
              </Layout>
            </SocketProvider>
          </ToastProvider>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
