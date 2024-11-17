import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const AuthMode: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm border border-gray-300 mt-4">
        {" "}
        {/* Changed padding and max-width */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {" "}
          {/* Reduced margin-bottom */}
          {isLoginMode ? "Login" : "Register"}
        </h1>
        {isLoginMode ? <Login /> : <Register />}
        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isLoginMode
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <span
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthMode;
