// src/components/HeroSection.jsx
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import demoVideo from "../assets/videos/dishaa-demo.mp4";
import './HeroSection.css';

const HeroSection = () => {
  const { t } = useTranslation();
  const [showVideo, setShowVideo] = useState(false);

  const handleWatchDemo = () => {
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <section className="hero">
      <div className="overlay">
        <div className="top-heading">{t('AI BASED INTERNSHIP RECOMMANDATION ENGINE')}</div>
        
        <h1 className="main-heading">Find Your Perfect <br /> <span>Internship Match</span></h1>

        
        <p className="sub-text">
          AI-powered recommendations designed for students from rural areas, tribal districts, <br />
         and urban communities. Get personalized internship suggestions that match your skills  <br />
          and aspirations.
      </p>

        
        <div className="cta-buttons">
          <button className="start-btn" onClick={() => navigate("/login")}>Start Your Journey →</button>
          <button className="demo-btn" onClick={handleWatchDemo}>
            ▶️ {t('Watch Demo')}
          </button>
        </div>

        
         <div className="stats">
        <div><strong>10,000+</strong><p>Internships Available</p></div>
        <div><strong>50,000+</strong><p>Students Registered</p></div>
        <div><strong>95%</strong><p>Match Accuracy</p></div>
        <div><strong>500+</strong><p>Partner Companies</p></div>

        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="video-modal-overlay" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-video-btn" onClick={closeVideo}>×</button>
            
            <video controls autoPlay className="demo-video">
              <source src={demoVideo} type="video/mp4" />
              {t('Your browser does not support the video tag.')}
            </video>
            
            <div className="video-info">
              <h3>{t('DISHAA Platform Demo')}</h3>
              <p>{t('See how our AI-powered platform helps students find perfect internships')}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;