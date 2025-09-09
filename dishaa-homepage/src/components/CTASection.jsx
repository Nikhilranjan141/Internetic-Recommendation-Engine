import React from "react";
import "./CTASection.css";

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2>Ready to Find Your Perfect Internship?</h2>
        <p>
          Join thousands of students who have already discovered amazing<br />
          opportunities through DISHAA
        </p>
        <button className="cta-button">
          Get Started Now →
        </button>
      </div>
    </section>
  );
};

export default CTASection;