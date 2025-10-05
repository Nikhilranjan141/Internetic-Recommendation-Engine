// src/App.jsx (FULLY UPDATED VERSION)
import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { LanguageProvider } from "./context/LanguageContext"; // ✅ ADDED MISSING IMPORT

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrowseInternships from "./components/BrowseInternships"; 
import Profile from "./pages/Profile";
import FloatingChatbot from "./components/FloatingChatbot/FloatingChatbot";

import "./index.css";

function App() {
  return (
    <LanguageProvider> {/* ✅ ADDED LanguageProvider WRAPPER */}
      <UserProvider>
        <FloatingChatbot excludePages={['/login', '/register']} />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Header />
                <HeroSection />
                <WhyChoose />
                <HowItWorks />
                <SuccessStories />
                <CTASection />
                <Footer />
              </>
            } 
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse-internships" element={<BrowseInternships />} /> 
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;