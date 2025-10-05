import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileImage, setProfileImage] = useState(null);

  // Load profile completion and profile image from localStorage on component mount
  useEffect(() => {
    const savedCompletion = localStorage.getItem('profileCompletion');
    if (savedCompletion) {
      setProfileCompletion(parseInt(savedCompletion));
    }

    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const handleBrowseInternships = (e) => {
    e.preventDefault();
    navigate('/browse-internships');
  };

  const handleProfileNavigation = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  const handleDashboardNavigation = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  // Function to get user initials for profile icon
  const getInitials = () => {
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length > 1) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    return "👤";
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-top-nav">
        <div className="nav-left">
          <h1>DISHAA</h1>
        </div>
        
        <div className="nav-center">
          <div className="search-bar">
            <input type="text" placeholder={t('Search internships...')} />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#" className="nav-link active" onClick={handleDashboardNavigation}>
              {t('Dashboard')}
            </a>
            <a href="#" className="nav-link" onClick={handleBrowseInternships}>
              {t('Browse Internships')}
            </a>
            <a href="#" className="nav-link" onClick={handleProfileNavigation}>
              {t('Profile')}
            </a>
          </nav>
          <div className="nav-icons">
            <button className="icon-btn">🔔</button>
            <div className="profile-icon" onClick={handleProfileNavigation} style={{cursor: 'pointer'}}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-icon-image" />
              ) : (
                <span className="profile-icon-initials">{getInitials()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>{t('Welcome back')}, {user?.name || t('User')}! 👋</h2>
          <p>{t('Ready to discover your next opportunity?')}</p>
        </section>

        {/* Profile Completion */}
        <div className="profile-completion-section">
          <h3>{t('Complete Your Profile')}</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <span className="progress-text">
              {profileCompletion}% {t('complete')} - {t('Add skills and preferences to get better recommendations')}
            </span>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">{t('Applications Sent')}</div>
            <div className="stat-trend">+3 {t('this week')}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">48</div>
            <div className="stat-label">{t('Profile Views')}</div>
            <div className="stat-trend">+15 {t('this week')}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">156</div>
            <div className="stat-label">{t('Skill Matches')}</div>
            <div className="stat-trend">{t('Based on profile')}</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">24</div>
            <div className="stat-label">{t('Learning Hours')}</div>
            <div className="stat-trend">{t('This month')}</div>
          </div>
        </div>

        {/* Action Cards Section */}
        <div className="action-cards-section">
          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <h3>{t('Update Preferences')}</h3>
            <p>{t('Refine your internship preferences to get better matches')}</p>
          </div>

          <div className="action-card">
            <div className="action-icon">🔍</div>
            <h3 onClick={handleBrowseInternships} style={{cursor: 'pointer'}}>
              {t('Browse All Internships')}
            </h3>
            <p>{t('Explore hundreds of opportunities across different sectors')}</p>
          </div>

          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>{t('Skills Assessment')}</h3>
            <p>{t('Take assessments to showcase your abilities to employers')}</p>
          </div>
        </div>

        {/* Recommended Internships Section */}
        <div className="recommended-section">
          <div className="recommended-header">
            <h2>{t('Recommended for You')}</h2>
            <p>{t('Personalized matches based on your profile and preferences')}</p>
          </div>

          <div className="internship-cards">
            {/* Frontend Developer Intern */}
            <div className="internship-card">
              <div className="card-header">
                <h3>{t('Frontend Developer Intern')}</h3>
                <span className="match-badge">95% {t('Match')}</span>
              </div>
              <h4 className="company-name">{t('Tech Solutions Ltd.')}</h4>
              
              <div className="internship-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{t('Mumbai, Maharashtra')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏰</span>
                  <span>3 {t('months')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{t('Apply by')} Dec 15, 2024</span>
                </div>
              </div>
              
              <p className="internship-desc">
                {t('Join our dynamic team to build modern web applications using React and latest frontend technologies. Perfect for students looking to gain hands-on experience.')}
              </p>
              
              <div className="divider"></div>
              
              <div className="job-details">
                <span className="job-type full-time">{t('Full-time')}</span>
                <span className="salary">₹15,000/{t('month')}</span>
              </div>
              
              <div className="tech-tags-container">
                <span className="tech-tag">React</span>
                <span className="tech-tag">JavaScript</span>
                <span className="tech-tag">CSS</span>
                <span className="more-tags">+1 {t('more')}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="card-actions">
                <button className="apply-btn">{t('Apply Now')}</button>
                <button className="view-btn">{t('View Details')}</button>
              </div>
            </div>

            {/* Data Science Intern */}
            <div className="internship-card">
              <div className="card-header">
                <h3>{t('Data Science Intern')}</h3>
                <span className="match-badge">88% {t('Match')}</span>
              </div>
              <h4 className="company-name">{t('Analytics Pro')}</h4>
              
              <div className="internship-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{t('Bangalore, Karnataka')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏰</span>
                  <span>6 {t('months')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{t('Apply by')} Dec 20, 2024</span>
                </div>
              </div>
              
              <p className="internship-desc">
                {t('Work on real-world data science projects and contribute to AI-driven solutions for enterprise clients.')}
              </p>
              
              <div className="divider"></div>
              
              <div className="job-details">
                <span className="job-type remote">{t('Remote')}</span>
                <span className="salary">₹20,000/{t('month')}</span>
              </div>
              
              <div className="tech-tags-container">
                <span className="tech-tag">Python</span>
                <span className="tech-tag">{t('Machine Learning')}</span>
                <span className="tech-tag">SQL</span>
                <span className="more-tags">+1 {t('more')}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="card-actions">
                <button className="apply-btn">{t('Apply Now')}</button>
                <button className="view-btn">{t('View Details')}</button>
              </div>
            </div>

            {/* Digital Marketing Intern */}
            <div className="internship-card">
              <div className="card-header">
                <h3>{t('Digital Marketing Intern')}</h3>
                <span className="match-badge">82% {t('Match')}</span>
              </div>
              <h4 className="company-name">{t('Creative Agency Inc.')}</h4>
              
              <div className="internship-details">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{t('Delhi, Delhi')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏰</span>
                  <span>4 {t('months')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{t('Apply by')} Dec 25, 2024</span>
                </div>
              </div>
              
              <p className="internship-desc">
                {t('Learn digital marketing strategies and execute campaigns for leading brands in various industries.')}
              </p>
              
              <div className="divider"></div>
              
              <div className="job-details">
                <span className="job-type part-time">{t('Part-time')}</span>
                <span className="salary">₹12,000/{t('month')}</span>
              </div>
              
              <div className="tech-tags-container">
                <span className="tech-tag">{t('Social Media')}</span>
                <span className="tech-tag">{t('Content Writing')}</span>
                <span className="tech-tag">SEO</span>
                <span className="more-tags">+1 {t('more')}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="card-actions">
                <button className="apply-btn">{t('Apply Now')}</button>
                <button className="view-btn">{t('View Details')}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity-section">
          <h3>{t('Recent Activity')}</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-content">
                <p>{t('Applied to Frontend Developer position at Tech Solutions Ltd.')}</p>
                <span className="activity-time">2 {t('hours ago')}</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">👀</div>
              <div className="activity-content">
                <p>{t('Profile viewed by Analytics Pro Hiring team')}</p>
                <span className="activity-time">1 {t('day ago')}</span>
              </div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <p>{t('Completed JavaScript skill assessment - Score: 85/100')}</p>
                <span className="activity-time">3 {t('days ago')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;