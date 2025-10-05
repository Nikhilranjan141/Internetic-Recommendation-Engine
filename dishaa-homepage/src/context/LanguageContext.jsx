// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = {
    en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' }
  };

  const changeLanguage = (langCode) => {
    if (langCode === currentLanguage) return;
    
    setIsTranslating(true);
    setTimeout(() => {
      setCurrentLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      setIsTranslating(false);
    }, 200);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    changeLanguage,
    languages,
    isTranslating
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};