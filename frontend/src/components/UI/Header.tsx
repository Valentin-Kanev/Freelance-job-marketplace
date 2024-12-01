import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import CreateJob from "../jobs/jobActions/CreateJob";

const Header: React.FC = () => {
  const { isLoggedIn, userType, userId, logout } = useAuth();

  return (
    <header className="bg-gray-800 p-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand */}
        <div className="text-white text-2xl font-bold">
          <Link to="/" className="hover:text-gray-400">
            Job Portal
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4 items-center">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile-management"
                className="text-white hover:text-gray-400"
              >
                View Profile
              </Link>
              {userType === "client" && (
                <CreateJob userId={userId || ""} isLoggedIn={isLoggedIn} />
              )}
              <button
                onClick={logout}
                className="text-white hover:text-gray-400"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-white hover:text-gray-400">
              Login/Register
            </Link>
          )}
          <Link to="/jobs" className="text-white hover:text-gray-400">
            Jobs
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
