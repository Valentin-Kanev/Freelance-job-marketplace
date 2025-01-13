import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JobManagement from "./components/jobs/JobsManagment";
import JobDashboard from "./components/jobs/JobDashboard";
import ProtectedRoute from "./components/userAuthentication/Protectedroute";
import Header from "./components/UI/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProfileContainer } from "./components/profile/ProfileContainer";
import AuthMode from "./components/userAuthentication/AuthMode";
import { ToastProvider } from "./contexts/ToastManager";
import { useJobs } from "./hooks/useJobs";
import FreelancerProfilesList from "./components/profile/ProfilesList";
import ProfileDetails from "./components/profile/ProfileDetails";
import { SocketProvider } from "./hooks/useSocket";
import ChatContainer from "./components/chat/ChatContainer";
import { ChatProvider } from "./contexts/ChatContext";
import { ChatButtonWrapper } from "./components/chat/ChatButtonWrapper";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col">
        <Header />
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <ToastProvider>
            <SocketProvider>
              <Routes>
                <Route
                  path="*"
                  element={
                    <Layout>
                      <AppRoutes />
                      <ChatButtonWrapper />
                    </Layout>
                  }
                />
              </Routes>
            </SocketProvider>
          </ToastProvider>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { userId } = useAuth();
  const safeUserId = userId ?? "";

  const { data: jobs, isLoading, isError, error } = useJobs();

  return (
    <Routes>
      <Route path="/auth" element={<AuthMode />} />
      <Route path="/auth/login" element={<AuthMode />} />
      <Route path="/auth/register" element={<AuthMode />} />
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
  );
};

export default App;
