import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Import the useAuth hook

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth(); // Access the authentication state and logout function

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
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/profile-management"
                className="text-white hover:text-gray-400"
              >
                View Profile
              </Link>
              <button
                onClick={logout} // Call the logout function from the context
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
          <Link to="/" className="text-white hover:text-gray-400">
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
