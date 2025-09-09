import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Register.css";

const Register = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      newErrors.phone = "Enter a valid 10-digit phone number (without +91)";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      });
      navigate("/dashboard");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="register-main-container">
      <div className="register-background">
        <div className="register-content">
          {/* Header */}
          <div className="register-header">
            <h1>DISHAA</h1>
            <p>Find the perfect internship opportunity for your skills</p>
            <div className="register-nav">
              <span>English</span>
              <a href="#" onClick={handleLoginRedirect}>Sign In</a>
              <a href="#" style={{background: '#f1f3f5'}}>Join DISHAA</a>
            </div>
          </div>

          {/* Register Form */}
          <div className="register-form-box">
            <h2>Join DISHAA</h2>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-input-group">
                  <label className="input-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="register-input"
                  />
                  {errors.firstName && (
                    <span className="error">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-input-group">
                  <label className="input-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="register-input"
                  />
                  {errors.lastName && (
                    <span className="error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="register-input"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number (without +91)"
                  className="register-input"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="form-input-group">
                <label className="input-label">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="register-input"
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>
                {errors.password && <span className="error">{errors.password}</span>}
              </div>

              <button type="submit" className="register-submit-button">
                Create Account
              </button>
            </form>

            <div className="register-footer">
              <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;