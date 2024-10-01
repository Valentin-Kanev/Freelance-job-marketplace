// src/components/UserManagement.tsx
import React, { useState } from "react";
import { useRegisterUser, useLoginUser } from "../hooks/useAuth";

const UserManagement: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const registerMutation = useRegisterUser();
  const loginMutation = useLoginUser();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ username, password, email, user_type: userType });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div>
      <h1>{isLoginMode ? "Login" : "Register"} User</h1>
      <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
        {!isLoginMode && (
          <>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>User Type</label>
              <input
                type="text"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLoginMode ? "Login" : "Register"}</button>
      </form>
      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Switch to Register" : "Switch to Login"}
      </button>

      {/* Error Messages */}
      {registerMutation.isError && <p>{registerMutation.error?.message}</p>}
      {loginMutation.isError && <p>{loginMutation.error?.message}</p>}
    </div>
  );
};

export default UserManagement;
