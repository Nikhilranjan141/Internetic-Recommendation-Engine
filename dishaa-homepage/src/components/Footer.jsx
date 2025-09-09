import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>DISHAA</h3>
          <p>AI Internship Recommendations</p>
          <p className="government-text">
            A Government of India initiative under the PM Internship Scheme, helping students discover the right opportunities.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><a href="#">Browse Internships</a></li>
              <li><a href="#">Partner Companies</a></li>
              <li><a href="#">About DISHAA</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Guidelines</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2024 DISHAA - Government of India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;