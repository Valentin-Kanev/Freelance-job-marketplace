import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

const AuthMode: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginMode = location.pathname === "/auth/login";

  const handleRegistrationSuccess = () => {
    navigate("/auth/login");
  };

  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/auth/login");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 mt-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-300 mt-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {isLoginMode ? "Login" : "Register"}
        </h1>
        {isLoginMode ? (
          <Login />
        ) : (
          <Register onRegistrationSuccess={handleRegistrationSuccess} />
        )}
        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <span
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
            onClick={() =>
              navigate(isLoginMode ? "/auth/register" : "/auth/login")
            }
          >
            {isLoginMode ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthMode;
