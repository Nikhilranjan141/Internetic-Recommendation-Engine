import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseInternships.css";

const BrowseInternships = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [userSkills, setUserSkills] = useState([]);

  // Load profile image and user skills from localStorage on component mount
  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }

    // Load user skills from profile data
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        if (parsedData.skills) {
          setUserSkills(parsedData.skills);
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
  }, []);

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
      match: 95,
      company: "Tech Solutions Ltd.",
      location: "Mumbai, Maharashtra",
      duration: "3 months",
      applyBy: "Dec 15, 2024",
      description: "Join our dynamic team to build modern web applications using React and latest frontend technologies. Perfect for students looking to gain hands-on experience in a fast-paced environment.",
      type: "Full-time",
      salary: "₹15,000/month",
      skills: ["React", "JavaScript", "CSS", "HTML"]
    },
    {
      id: 2,
      title: "Data Science Intern",
      match: 88,
      company: "Analytics Pro",
      location: "Bangalore, Karnataka",
      duration: "6 months",
      applyBy: "Dec 20, 2024",
      description: "Work on real-world data science projects and contribute to AI-driven solutions for enterprise clients. Great opportunity to work with cutting-edge technologies.",
      type: "Remote",
      salary: "₹20,000/month",
      skills: ["Python", "Machine Learning", "SQL", "Data Analysis"]
    },
    {
      id: 3,
      title: "Digital Marketing Intern",
      match: 82,
      company: "Creative Agency Inc.",
      location: "Delhi, Delhi",
      duration: "4 months",
      applyBy: "Dec 25, 2024",
      description: "Learn digital marketing strategies and execute campaigns for leading brands in various industries. Perfect for creative minds with business acumen.",
      type: "Part-time",
      salary: "₹12,000/month",
      skills: ["Social Media", "Content Writing", "SEO", "Google Analytics"]
    },
    {
      id: 4,
      title: "Mobile App Developer Intern",
      match: 91,
      company: "InnovateTech",
      location: "Hyderabad, Telangana",
      duration: "5 months",
      applyBy: "Dec 18, 2024",
      description: "Develop cross-platform mobile applications for startups and established companies. Great opportunity to work on user-facing products.",
      type: "Full-time",
      salary: "₹18,000/month",
      skills: ["React Native", "Flutter", "JavaScript", "Mobile Development"]
    },
    {
      id: 5,
      title: "Content Writing Intern",
      match: 75,
      company: "Media House",
      location: "Chennai, Tamil Nadu",
      duration: "3 months",
      applyBy: "Dec 22, 2024",
      description: "Create engaging content for blogs, social media, and marketing campaigns. Perfect for students passionate about storytelling and communication.",
      type: "Part-time",
      salary: "₹10,000/month",
      skills: ["Writing", "Research", "SEO", "Content Strategy"]
    },
    {
      id: 6,
      title: "UI/UX Design Intern",
      match: 87,
      company: "Design Studio",
      location: "Pune, Maharashtra",
      duration: "4 months",
      applyBy: "Dec 28, 2024",
      description: "Design beautiful and functional user interfaces for web and mobile applications. Work closely with product teams to create amazing user experiences.",
      type: "Full-time",
      salary: "₹16,000/month",
      skills: ["Figma", "Adobe XD", "User Research", "Wireframing"]
    }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInternships, setFilteredInternships] = useState(allInternships);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      setFilteredInternships(allInternships);
    } else {
      const filtered = allInternships.filter(internship => 
        internship.title.toLowerCase().includes(term) ||
        internship.company.toLowerCase().includes(term) ||
        internship.skills.some(skill => skill.toLowerCase().includes(term)) ||
        internship.location.toLowerCase().includes(term) ||
        internship.type.toLowerCase().includes(term)
      );
      setFilteredInternships(filtered);
    }
  };

  const handleNavSearch = (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term === "") {
      setFilteredInternships(allInternships);
    } else {
      const filtered = allInternships.filter(internship => 
        internship.title.toLowerCase().includes(term) ||
        internship.company.toLowerCase().includes(term) ||
        internship.skills.some(skill => skill.toLowerCase().includes(term)) ||
        internship.location.toLowerCase().includes(term) ||
        internship.type.toLowerCase().includes(term)
      );
      setFilteredInternships(filtered);
    }
  };

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
              placeholder="Search internships..." 
              onChange={handleNavSearch}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={handleDashboard}>Dashboard</a>
            <a href="#" className="nav-link active">Browse Internships</a>
            <a href="#" className="nav-link" onClick={handleProfileNavigation}>Profile</a>
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
          <h2>Browse Internships</h2>
          <p>Discover hundreds of internship opportunities across India</p>
          {userSkills.length > 0 && (
            <div className="user-skills-info">
              <p>Your skills: <strong>{userSkills.join(', ')}</strong></p>
            </div>
          )}
        </div>

        {/* Search Bar - Left Aligned */}
        <div className="search-section-left">
          <input
            type="text"
            placeholder="Search by title, company, or skills..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input-left"
          />
        </div>

        {/* Results Count - Left Aligned */}
        <div className="results-info-left">
          <h3>{filteredInternships.length} Internships Found</h3>
          <p>Showing {searchTerm ? "filtered" : "all available"} opportunities</p>
        </div>

        {/* Internships List - Left Aligned */}
        <div className="internships-list-left">
          {filteredInternships.length === 0 ? (
            <div className="no-results">
              <h3>No internships found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredInternships.map(internship => {
              const missingSkills = getMissingSkills(internship.skills);
              
              return (
                <div key={internship.id} className="internship-item-left">
                  <div className="internship-header-left">
                    <h3 className="internship-title-left">{internship.title} <span className="match-badge-left">{internship.match}% Match</span></h3>
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
                      <span>Apply by {internship.applyBy}</span>
                    </div>
                  </div>
                  
                  <p className="description-left">{internship.description}</p>
                  
                  <div className="job-info-left">
                    <span className="job-type-left">{internship.type}</span>
                    <span className="salary-left">{internship.salary}</span>
                  </div>
                  
                  <div className="skills-container-left">
                    <div className="skills-header-left">
                      <strong>Required Skills:</strong>
                    </div>
                    {internship.skills.map((skill, index) => {
                      const hasThisSkill = hasSkill(skill);
                      
                      return (
                        <span 
                          key={index} 
                          className={`skill-tag-left ${hasThisSkill ? 'skill-present' : 'skill-missing'}`}
                          title={hasThisSkill ? "You have this skill" : "You don't have this skill"}
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
                        <strong>Skills you're missing:</strong> {missingSkills.join(', ')}
                      </p>
                      <p className="suggestion-text">
                        Add these skills to your profile to improve your chances!
                      </p>
                    </div>
                  )}
                  
                  <div className="action-buttons-left">
                    <button className="apply-button-left">Apply Now</button>
                    <button className="view-button-left">View Details</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Load More Section - Left Aligned */}
        <div className="load-more-section-left">
          <button className="load-more-btn-left">Load More Internships</button>
          <p className="load-more-text-left">Showing {filteredInternships.length} of 156 internships</p>
        </div>

        {/* Stats Section - Left Aligned */}
        <div className="stats-section-left">
          <div className="stat-left">
            <strong>500+</strong>
            <p>Active Internships</p>
          </div>
          <div className="stat-left">
            <strong>50+</strong>
            <p>Cities Covered</p>
          </div>
          <div className="stat-left">
            <strong>24/7</strong>
            <p>Platform Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseInternships;