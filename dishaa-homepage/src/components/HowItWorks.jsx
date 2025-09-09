import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>How DISHAA Works</h2>
      <p className="subtitle">
        Simple steps to find your perfect internship match
      </p>

      <div className="steps">
        <div className="step-card">
          <div className="icon">📝</div>
          <h3>Create Your Profile</h3>
          <p>
            Tell us about your education, skills, interests, and location preferences.
            Simple form, no complex details required.
          </p>
        </div>

        <div className="step-card">
          <div className="icon">🧠</div>
          <h3>AI Analysis</h3>
          <p>
            Our smart algorithm analyzes thousands of internships to find the best
            2–5 matches for your unique profile.
          </p>
        </div>

        <div className="step-card">
          <div className="icon">✅</div>
          <h3>Apply & Succeed</h3>
          <p>
            Review your personalized recommendations and apply to internships that
            truly match your goals and abilities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
