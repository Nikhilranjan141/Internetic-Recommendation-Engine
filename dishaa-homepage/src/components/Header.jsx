import React from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="DISHAA Logo" className="logo" />
        <div className="title">
          <h1>DISHAA</h1>
          <p>AI Internship Recommendations</p>
        </div>
      </div>
      <div className="nav">
        <span>English</span>
        {/* <a href="#" onClick={handleSignIn}>Sign In</a> */}
        <a href="#"  className="sign-in-btn" onClick={handleSignIn}>Sign In</a>
        {/* <a href="#" className="sign-in-btn">Sign In</a> */}
        <button className="get-started" onClick={handleGetStarted}>Get Started</button>
      </div>
    </header>
  );
};

export default Header;