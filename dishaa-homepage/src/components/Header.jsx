// src/components/Header.jsx (Updated)
import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const Header = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, languages, isTranslating } = useLanguage();
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLangData = languages[currentLanguage];

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="DISHAA Logo" className="logo" />
        <div className="title">
          <h1>DISHAA</h1>
          <p>{t('AI Internship Recommendations')}</p>
        </div>
      </div>
      
      <div className="nav">
        {/* Language Selector */}
        <div className="language-selector" ref={dropdownRef}>
          <button 
            className={`language-current ${isTranslating ? 'translating' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isTranslating}
          >
            <span className="language-flag">{currentLangData.flag}</span>
            <span className="language-name">{currentLangData.name}</span>
            <span className="dropdown-arrow">▾</span>
            {isTranslating && <span className="translating-spinner">⟳</span>}
          </button>

          {isDropdownOpen && (
            <div className="language-dropdown">
              {Object.values(languages).map((lang) => (
                <button
                  key={lang.code}
                  className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-native">{lang.nativeName}</span>
                  <span className="language-english">({lang.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="#" className="sign-in-btn" onClick={handleSignIn}>
          {t('Sign In')}
        </a>
        <button className="get-started" onClick={handleGetStarted}>
          {t('Get Started')}
        </button>
      </div>
    </header>
  );
};

export default Header;