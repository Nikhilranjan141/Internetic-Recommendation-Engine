import React from "react";
import "./SuccessStories.css";

const SuccessStories = () => {
  return (
    <section className="success-stories">
      <h2>Success Stories</h2>
      <p className="subtitle">
        Hear from students who found their dream internships with DISHAA
      </p>
      
      <div className="testimonials">
        <div className="testimonial-card">
         <div className="rating">★★★★★</div>
          <div className="quote">
            <p>"DISHAA helped me find the perfect tech internship. The AI recommendations were spot-on!"</p>
          </div>
          <div className="student-info">
            <h4>Priya Sharma</h4>
            <p>Computer Science Student</p>
            <p>Rural Maharashtra</p>
          </div>
        </div>
        
        <div className="testimonial-card">
         <div className="rating">★★★★★</div>
          <div className="quote">
            <p>"As a first-generation college student, DISHAA made internship hunting so much easier."</p>
          </div>
          <div className="student-info">
            <h4>Amit Kumar</h4>
            <p>Engineering Student</p>
            <p>Jharkhand Tribal Area</p>
          </div>
        </div>
        
        <div className="testimonial-card">
         <div className="rating">★★★★★</div>
          <div className="quote">
            <p>"Got my dream internship in just 2 weeks thanks to DISHAA's smart recommendations."</p>
          </div>
          <div className="student-info">
            <h4>Sneha Patel</h4>
            <p>Business Student</p>
            <p>Gujarat</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;