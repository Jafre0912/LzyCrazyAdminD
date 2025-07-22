// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from '../assets/login.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple hardcoded login check (replace with actual logic)
    if (email && password) {
      navigate("/upload"); // Redirect to UploadPanel after login
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="logo">👨‍💼</div>
        <h2>🔒 Admin Login</h2>
        <p>Welcome back, please enter your credentials</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot">Forgot Password</span>
          </div>
          <button className="login-btn" type="submit">Login</button>
          <p className="note">Secure admin access only</p>
          <span className="create-account">Create Account</span>
        </form>
      </div>

      <div className="login-right">
        <img
          src={login}
          alt="Secure Login"
        />
      </div>
    </div>
  );
};

export default Login;
