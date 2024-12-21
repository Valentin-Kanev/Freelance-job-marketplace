import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CreateJob from "../jobs/jobActions/CreateJob";

const Header: React.FC = () => {
  const { isLoggedIn, userType, userId, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    return currentPath === path || currentPath.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 p-3 shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-white text-lg font-semibold">
          <Link to="/" className="hover:text-gray-400">
            Job Portal
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          <Link
            to="/jobs"
            className={`text-white hover:text-gray-300 pb-1 border-b-2 transform transition-all duration-300 ease-in-out ${
              isActive("/jobs") || isActive("/jobs/:jobId")
                ? "border-white scale-105"
                : "border-transparent"
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/profiles"
            className={`text-white hover:text-gray-300 pb-1 border-b-2 transform transition-all duration-300 ease-in-out ${
              isActive("/profiles")
                ? "border-white scale-105"
                : "border-transparent"
            }`}
          >
            Browse Freelancers
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                to="/profile-management"
                className={`text-white hover:text-gray-300 pb-1 border-b-2 transform transition-all duration-300 ease-in-out ${
                  isActive("/profile-management")
                    ? "border-white scale-105"
                    : "border-transparent"
                }`}
              >
                View Profile
              </Link>

              <div className="pb-1 ">
                {userType === "client" && (
                  <CreateJob userId={userId || ""} isLoggedIn={isLoggedIn} />
                )}
              </div>
              <button
                onClick={logout}
                className="text-white hover:text-gray-300 pb-1"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className={`text-white hover:text-gray-300 pb-1 border-b-2 transform transition-all duration-300 ease-in-out ${
                isActive("/auth")
                  ? "border-white scale-105"
                  : "border-transparent"
              }`}
            >
              Login/Register
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
