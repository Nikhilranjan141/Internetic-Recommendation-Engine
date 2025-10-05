import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";
import "./BrowseInternships.css";

const BrowseInternships = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state add kiya

  // Load profile image, user skills and preferences from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedProfileImage = localStorage.getItem('profileImage');
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        }

        const savedProfileData = localStorage.getItem('profileData');
        if (savedProfileData) {
          const parsedData = JSON.parse(savedProfileData);
          if (parsedData.skills) {
            setUserSkills(parsedData.skills);
          }
          if (parsedData.preferences) {
            setUserPreferences(parsedData.preferences);
          }
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
      } finally {
        setIsLoading(false); // ✅ Loading complete
      }
    };

    loadUserData();
  }, []);

  // ✅ Force content visibility after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      // Force CSS to apply properly
      const elements = document.querySelectorAll('.browse-content-left, .internships-list-left');
      elements.forEach(el => {
        if (el) {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Function to calculate match percentage based on skills
  const calculateMatchPercentage = (internshipSkills) => {
    if (userSkills.length === 0) return 0;
    
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    const internshipSkillsLower = internshipSkills.map(skill => 
      skill.toLowerCase().replace(/\+[0-9]+\s*more/, '').trim()
    );
    
    // Count matching skills
    const matchingSkills = internshipSkillsLower.filter(skill => 
      userSkillsLower.some(userSkill => userSkill.toLowerCase().includes(skill))
    );
    
    // Calculate percentage
    const percentage = (matchingSkills.length / internshipSkillsLower.length) * 100;
    return Math.round(percentage);
  };

  // Function to check which skills are missing for an internship
  const getMissingSkills = (internshipSkills) => {
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());
    const internshipSkillsLower = internshipSkills.map(skill => {
      const cleanSkill = skill.replace(/\+[0-9]+\s*more/, '').trim().toLowerCase();
      return cleanSkill;
    });
    
    const missingSkills = internshipSkillsLower.filter(skill => 
      !userSkillsLower.includes(skill) && skill !== '' && !skill.includes('more')
    );
    
    return missingSkills;
  };

  // Function to check if user has a specific skill
  const hasSkill = (skill) => {
    const cleanSkill = skill.replace(/\+[0-9]+\s*more/, '').trim().toLowerCase();
    return userSkills.some(userSkill => 
      userSkill.toLowerCase() === cleanSkill
    );
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
  };

  // Function to get user initials for profile icon
  const getInitials = () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      const names = userName.split(' ');
      if (names.length > 1) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    return "👤";
  };

  const allInternships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Solutions Ltd.",
      location: "Mumbai, Maharashtra",
      duration: "3 months",
      applyBy: "Dec 15, 2024",
      description: "Join our dynamic team to build modern web applications using React and latest frontend technologies. Perfect for students looking to gain hands-on experience in a fast-paced environment.",
      type: "Full-time",
      salary: "₹15,000/month",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      sector: "Technology"
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Analytics Pro",
      location: "Bangalore, Karnataka",
      duration: "6 months",
      applyBy: "Dec 20, 2024",
      description: "Work on real-world data science projects and contribute to AI-driven solutions for enterprise clients. Great opportunity to work with cutting-edge technologies.",
      type: "Remote",
      salary: "₹20,000/month",
      skills: ["Python", "Machine Learning", "SQL", "Data Analysis"],
      sector: "Technology"
    },
    {
      id: 3,
      title: "Digital Marketing Intern",
      company: "Creative Agency Inc.",
      location: "Delhi, Delhi",
      duration: "4 months",
      applyBy: "Dec 25, 2024",
      description: "Learn digital marketing strategies and execute campaigns for leading brands in various industries. Perfect for creative minds with business acumen.",
      type: "Part-time",
      salary: "₹12,000/month",
      skills: ["Social Media", "Content Writing", "SEO", "Google Analytics"],
      sector: "Marketing"
    },
    {
      id: 4,
      title: "Mobile App Developer Intern",
      company: "InnovateTech",
      location: "Hyderabad, Telangana",
      duration: "5 months",
      applyBy: "Dec 18, 2024",
      description: "Develop cross-platform mobile applications for startups and established companies. Great opportunity to work on user-facing products.",
      type: "Full-time",
      salary: "₹18,000/month",
      skills: ["React Native", "Flutter", "JavaScript", "Mobile Development"],
      sector: "Technology"
    },
    {
      id: 5,
      title: "Content Writing Intern",
      company: "Media House",
      location: "Chennai, Tamil Nadu",
      duration: "3 months",
      applyBy: "Dec 22, 2024",
      description: "Create engaging content for blogs, social media, and marketing campaigns. Perfect for students passionate about storytelling and communication.",
      type: "Part-time",
      salary: "₹10,000/month",
      skills: ["Writing", "Research", "SEO", "Content Strategy"],
      sector: "Marketing"
    },
    {
      id: 6,
      title: "UI/UX Design Intern",
      company: "Design Studio",
      location: "Pune, Maharashtra",
      duration: "4 months",
      applyBy: "Dec 28, 2024",
      description: "Design beautiful and functional user interfaces for web and mobile applications. Work closely with product teams to create amazing user experiences.",
      type: "Full-time",
      salary: "₹16,000/month",
      skills: ["Figma", "Adobe XD", "User Research", "Wireframing"],
      sector: "Design"
    },
    {
      id: 7,
      title: "Finance Intern",
      company: "Global Bank Ltd.",
      location: "Mumbai, Maharashtra",
      duration: "6 months",
      applyBy: "Dec 30, 2024",
      description: "Assist in financial analysis, reporting, and budgeting activities. Great opportunity for finance students to gain practical experience.",
      type: "Full-time",
      salary: "₹18,000/month",
      skills: ["Excel", "Financial Analysis", "Accounting", "Reporting"],
      sector: "Finance"
    },
    {
      id: 8,
      title: "Healthcare Intern",
      company: "MediCare Hospitals",
      location: "Bangalore, Karnataka",
      duration: "3 months",
      applyBy: "Dec 28, 2024",
      description: "Support healthcare professionals in patient care and administrative tasks. Ideal for medical and healthcare students.",
      type: "Full-time",
      salary: "₹12,000/month",
      skills: ["Patient Care", "Medical Knowledge", "Communication", "Teamwork"],
      sector: "Healthcare"
    }
  ];

  // Filter internships based on search term and user preferences
  const filteredInternships = allInternships.filter(internship => {
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        internship.title.toLowerCase().includes(term) ||
        internship.company.toLowerCase().includes(term) ||
        internship.skills.some(skill => skill.toLowerCase().includes(term)) ||
        internship.location.toLowerCase().includes(term) ||
        internship.type.toLowerCase().includes(term) ||
        internship.sector.toLowerCase().includes(term);
      
      if (!matchesSearch) return false;
    }

    // Preferences filter
    if (userPreferences.sector && userPreferences.sector !== "") {
      if (internship.sector.toLowerCase() !== userPreferences.sector.toLowerCase()) {
        return false;
      }
    }

    if (userPreferences.type && userPreferences.type !== "") {
      if (internship.type.toLowerCase() !== userPreferences.type.toLowerCase()) {
        return false;
      }
    }

    if (userPreferences.duration && userPreferences.duration !== "") {
      const internshipDuration = parseInt(internship.duration);
      const preferredDuration = parseInt(userPreferences.duration);
      
      if (internshipDuration < preferredDuration) {
        return false;
      }
    }

    return true;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNavSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // ✅ Loading screen agar data load ho raha hai
  if (isLoading) {
    return (
      <div className="browse-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-top-nav">
        <div className="nav-left">
          <h1>DISHAA</h1>
        </div>
        
        <div className="nav-center">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder={t("Search internships...")} 
              onChange={handleNavSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={handleDashboard}>{t("Dashboard")}</a>
            <a href="#" className="nav-link active">{t("Browse Internships")}</a>
            <a href="#" className="nav-link" onClick={handleProfileNavigation}>{t("Profile")}</a>
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

      {/* Main Content - Left Aligned */}
      <div className="browse-content-left">
        {/* Page Title - Left Aligned */}
        <div className="page-title-left">
          <h2>{t("Browse Internships")}</h2>
          <p>{t("Discover hundreds of internship opportunities across India")}</p>
          {userSkills.length > 0 && (
            <div className="user-skills-info">
              <p>{t("Your skills")}: <strong>{userSkills.join(', ')}</strong></p>
            </div>
          )}
        </div>

        {/* User Preferences Info */}
        {(userPreferences.sector || userPreferences.type || userPreferences.duration) && (
          <div className="preferences-info">
            <h4>{t("Showing internships matching your preferences")}:</h4>
            <div className="preferences-tags">
              {userPreferences.sector && (
                <span className="preference-tag">{t("Sector")}: {userPreferences.sector}</span>
              )}
              {userPreferences.type && (
                <span className="preference-tag">{t("Type")}: {userPreferences.type}</span>
              )}
              {userPreferences.duration && (
                <span className="preference-tag">{t("Duration")}: {userPreferences.duration}</span>
              )}
            </div>
          </div>
        )}

        {/* Search Bar - Left Aligned */}
        <div className="search-section-left">
          <input
            type="text"
            placeholder={t("Search by title, company, skills, or sector...")}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input-left"
          />
        </div>

        {/* Results Count - Left Aligned */}
        <div className="results-info-left">
          <h3>{filteredInternships.length} {t("Internships Found")}</h3>
          <p>{t("Showing")} {searchTerm ? t("filtered") : t("all available")} {t("opportunities")}</p>
          {(userPreferences.sector || userPreferences.type || userPreferences.duration) && (
            <p className="preferences-filter-note">{t("Filtered by your preferences")}</p>
          )}
        </div>

        {/* Internships List - Left Aligned */}
        <div className="internships-list-left">
          {filteredInternships.length === 0 ? (
            <div className="no-results">
              <h3>{t("No internships found")}</h3>
              <p>{t("Try adjusting your search criteria or preferences")}</p>
              <button 
                className="clear-preferences-btn"
                onClick={() => window.location.reload()}
              >
                {t("Clear All Filters")}
              </button>
            </div>
          ) : (
            filteredInternships.map(internship => {
              const matchPercentage = calculateMatchPercentage(internship.skills);
              const missingSkills = getMissingSkills(internship.skills);
              
              return (
                <div key={internship.id} className="internship-item-left">
                  <div className="internship-header-left">
                    <h3 className="internship-title-left">
                      {internship.title} 
                      <span className={`match-badge-left ${
                        matchPercentage >= 80 ? 'match-badge-high' :
                        matchPercentage >= 50 ? 'match-badge-medium' : 'match-badge-low'
                      }`}>
                        {matchPercentage}% {t("Match")}
                      </span>
                    </h3>
                  </div>
                  
                  <h4 className="company-name-left">{internship.company}</h4>
                  
                  <div className="internship-details-left">
                    <div className="detail-left">
                      <span className="icon-left">📍</span>
                      <span>{internship.location}</span>
                    </div>
                    <div className="detail-left">
                      <span className="icon-left">⏰</span>
                      <span>{internship.duration}</span>
                    </div>
                    <div className="detail-left">
                      <span className="icon-left">📅</span>
                      <span>{t("Apply by")} {internship.applyBy}</span>
                    </div>
                    <div className="detail-left">
                      <span className="icon-left">🏢</span>
                      <span>{t("Sector")}: {internship.sector}</span>
                    </div>
                  </div>
                  
                  <p className="description-left">{internship.description}</p>
                  
                  <div className="job-info-left">
                    <span className="job-type-left">{internship.type}</span>
                    <span className="salary-left">{internship.salary}</span>
                  </div>
                  
                  <div className="skills-container-left">
                    <div className="skills-header-left">
                      <strong>{t("Required Skills")}:</strong>
                    </div>
                    {internship.skills.map((skill, index) => {
                      const hasThisSkill = hasSkill(skill);
                      
                      return (
                        <span 
                          key={index} 
                          className={`skill-tag-left ${hasThisSkill ? 'skill-present' : 'skill-missing'}`}
                          title={hasThisSkill ? t("You have this skill") : t("You don't have this skill")}
                        >
                          {skill}
                          {hasThisSkill ? ' ✓' : ' ✗'}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* Missing Skills Warning */}
                  {missingSkills.length > 0 && (
                    <div className="missing-skills-warning">
                      <p className="warning-text">
                        <strong>{t("Skills you're missing")}:</strong> {missingSkills.join(', ')}
                      </p>
                      <p className="suggestion-text">
                        {t("Add these skills to your profile to improve your chances!")}
                      </p>
                    </div>
                  )}
                  
                  <div className="action-buttons-left">
                    <button className="apply-button-left">{t("Apply Now")}</button>
                    <button className="view-button-left">{t("View Details")}</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Section - Left Aligned */}
        <div className="load-more-section-left">
          <button className="load-more-btn-left">{t("Load More Internships")}</button>
          <p className="load-more-text-left">{t("Showing")} {filteredInternships.length} {t("of")} {allInternships.length} {t("internships")}</p>
        </div>

        {/* Stats Section - Left Aligned */}
        <div className="stats-section-left">
          <div className="stat-left">
            <strong>500+</strong>
            <p>{t("Active Internships")}</p>
          </div>
          <div className="stat-left">
            <strong>50+</strong>
            <p>{t("Cities Covered")}</p>
          </div>
          <div className="stat-left">
            <strong>24/7</strong>
            <p>{t("Platform Support")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseInternships;