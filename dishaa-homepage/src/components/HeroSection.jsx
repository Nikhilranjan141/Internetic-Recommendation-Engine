import React from 'react';
import { useNavigate } from "react-router-dom";
import './HeroSection.css';

const HeroSection = () => {
    const navigate =  useNavigate();

  return (
    <section className="hero">
      <h2 className="top-heading">AI BASED INTERNSHIP RECOMMANDATION ENGINE</h2>
      <h1 className="main-heading">Find Your Perfect <br /> <span>Internship Match</span></h1>
      <p className="sub-text">
        AI-powered recommendations designed for students from rural areas, tribal districts, <br />
         and urban communities. Get personalized internship suggestions that match your skills  <br />
          and aspirations.
      </p>
      <div className="cta-buttons">
        <button className="start-btn" onClick={() => navigate("/login")}>Start Your Journey →</button>
        <button className="demo-btn">▶ Watch Demo</button>
      </div>
      <div className="stats">
        <div><strong>10,000+</strong><p>Internships Available</p></div>
        <div><strong>50,000+</strong><p>Students Registered</p></div>
        <div><strong>95%</strong><p>Match Accuracy</p></div>
        <div><strong>500+</strong><p>Partner Companies</p></div>
      </div>
    </section>
  );
};

export default HeroSection;