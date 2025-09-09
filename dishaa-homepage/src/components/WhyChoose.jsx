import React from "react";
import "./WhyChoose.css";

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <h2>Why Choose DISHAA?</h2>
      <p className="subtitle">
        Built specifically for Indian students with limited digital exposure and <br />
        no prior internship experience
      </p>

      <div className="features">
        <div className="feature-card">
          <div className="icon">🧠</div>
          <h3>AI-Powered Matching</h3>
          <p>
            Smart recommendations based on your skills, interests, and location
            preferences
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">🎯</div>
          <h3>Personalized Results</h3>
          <p>
            Get 3-5 top internship matches instead of browsing hundreds of
            listings
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">👥</div>
          <h3>For Everyone</h3>
          <p>
            Designed for first-generation learners from rural areas, tribal
            districts, and urban slums
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">📍</div>
          <h3>Location-Based</h3>
          <p>
            Find opportunities near you or explore remote internship options
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
