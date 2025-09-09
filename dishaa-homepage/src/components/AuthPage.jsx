import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./AuthPage.css";

const AuthPage = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setUser({
        name: "Demo User",
        email: formData.email,
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-main-container">
      <div className="auth-background">
        <div className="auth-content">
          {/* Header */}
          <div className="auth-header">
            <h1>DISHAA</h1>
            <p>Find the perfect internship opportunity for your skills</p>
          </div>

          {/* Login Form */}
          <div className="auth-form-box">
            <h2>Welcome Back</h2>
            <p className="welcome-subtitle">Continue your internship journey</p>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="auth-input"
                />
              </div>

              <div className="form-input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="auth-input"
                />
              </div>

              <div className="forgot-password-link">
                <a href="#">Forgot your password?</a>
              </div>

              <button type="submit" className="auth-submit-button">
                Sign In
              </button>
            </form>

            <div className="auth-footer">
              <p>A Government of India Initiative - PM Internship Scheme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;