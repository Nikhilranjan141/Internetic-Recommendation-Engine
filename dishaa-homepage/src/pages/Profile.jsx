import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const calculateProfileCompletion = (profileData) => {
  let completedFields = 0;
  let totalFields = 0;

  const basicInfoFields = ['firstName', 'lastName', 'email', 'phone', 'location'];
  totalFields += basicInfoFields.length;
  completedFields += basicInfoFields.filter(field => 
    profileData[field] && profileData[field].toString().trim() !== ''
  ).length;

  const educationFields = ['degree', 'university', 'year', 'cgpa'];
  totalFields += educationFields.length;
  completedFields += educationFields.filter(field => 
    profileData.education[field] && 
    profileData.education[field].toString().trim() !== '' && 
    profileData.education[field] !== 'Select year'
  ).length;

  totalFields += 1;
  if (profileData.skills && profileData.skills.length > 0) {
    completedFields += 1;
  }

  totalFields += 1;
  if (profileData.about && profileData.about.trim() !== '') {
    completedFields += 1;
  }

  const preferenceFields = ['sector', 'type', 'duration'];
  totalFields += preferenceFields.length;
  completedFields += preferenceFields.filter(field => 
    profileData.preferences[field] && profileData.preferences[field].trim() !== ''
  ).length;

  const socialMediaFields = ['linkedin', 'github', 'portfolio'];
  totalFields += socialMediaFields.length;
  completedFields += socialMediaFields.filter(field => 
    profileData.socialLinks && profileData.socialLinks[field] && profileData.socialLinks[field].trim() !== ''
  ).length;

  totalFields += 1;
  if (profileData.resume) {
    completedFields += 1;
  }

  return Math.round((completedFields / totalFields) * 100);
};

const checkAchievements = (profileData, completionPercentage) => {
  return {
    profileCompleter: completionPercentage >= 100,
    skillMaster: profileData.skills && profileData.skills.length >= 5,
    resumeReady: !!profileData.resume,
    socialButterfly: profileData.socialLinks && 
                    (profileData.socialLinks.linkedin || 
                     profileData.socialLinks.github || 
                     profileData.socialLinks.portfolio),
    detailOriented: profileData.about && profileData.about.length > 100
  };
};

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "",
    about: "",
    education: {
      degree: "",
      university: "",
      year: "Select year",
      cgpa: ""
    },
    skills: [],
    preferences: {
      sector: "",
      type: "",
      duration: ""
    },
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: ""
    },
    resume: null
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [achievements, setAchievements] = useState({
    profileCompleter: false,
    skillMaster: false,
    resumeReady: false,
    socialButterfly: false,
    detailOriented: false
  });

  const [newSkill, setNewSkill] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState("suggestion");

  const [marketTrends, setMarketTrends] = useState({
    reactJobs: '+32%',
    averageSalary: '₹8.2L',
    remoteJobs: '1.2K+',
    hiringCompanies: '250+'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: '🎉 Your profile is now in top 15%!', type: 'success' },
    { id: 2, message: '📊 5 new jobs match your skills', type: 'info' }
  ]);

  const [showRecruiterView, setShowRecruiterView] = useState(false);
  const [recruiterViewTab, setRecruiterViewTab] = useState('overview');

  useEffect(() => {
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
      setPhotoPreview(savedProfileImage);
    }

    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(parsedData);
        
        if (parsedData.resume && parsedData.resume.data) {
          const blob = new Blob([new Uint8Array(parsedData.resume.data)], { type: parsedData.resume.type });
          const url = URL.createObjectURL(blob);
          setResumeUrl(url);
        }
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }

    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
      try {
        const parsedAchievements = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements);
      } catch (error) {
        console.error('Error parsing achievements:', error);
      }
    }

    const savedCompletion = localStorage.getItem('profileCompletion');
    if (savedCompletion) {
      setProfileCompletion(parseInt(savedCompletion));
    }

    if (user?.name) {
      localStorage.setItem('userName', user.name);
    }

    const trendInterval = setInterval(() => {
      setMarketTrends(prev => ({
        ...prev,
        remoteJobs: `${Math.floor(Math.random() * 500) + 1000}+`,
        hiringCompanies: `${Math.floor(Math.random() * 50) + 200}+`
      }));
    }, 5000);

    return () => clearInterval(trendInterval);
  }, [user]);

  useEffect(() => {
    const completion = calculateProfileCompletion(profileData);
    setProfileCompletion(completion);
    
    const newAchievements = checkAchievements(profileData, completion);
    setAchievements(newAchievements);
    
    try {
      localStorage.setItem('profileCompletion', completion.toString());
      localStorage.setItem('profileData', JSON.stringify(profileData));
      localStorage.setItem('achievements', JSON.stringify(newAchievements));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
    }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `✅ Skill "${newSkill.trim()}" added successfully!`,
        type: 'success'
      }]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setProfilePhoto(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setPhotoPreview(imageData);
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData);
        
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: '📸 Profile photo updated successfully!',
          type: 'success'
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('pdf') && !file.type.includes('document')) {
        alert('Please select a PDF or DOC file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const resumeData = Array.from(new Uint8Array(arrayBuffer));
        
        setProfileData(prev => ({
          ...prev,
          resume: {
            name: file.name,
            size: file.size,
            type: file.type,
            data: resumeData
          }
        }));
        
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
        
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: '📄 Resume uploaded successfully!',
          type: 'success'
        }]);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveResume = () => {
    setProfileData(prev => ({
      ...prev,
      resume: null
    }));
    
    if (resumeUrl) {
      URL.revokeObjectURL(resumeUrl);
      setResumeUrl(null);
    }
    
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: '💾 Profile saved successfully!',
      type: 'success'
    }]);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log("Feedback submitted:", { type: feedbackType, message: feedback });
      setFeedbackSubmitted(true);
      setFeedback("");
      
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackSubmitted(false);
      }, 2000);
    }
  };

  const getInitials = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase();
    } else if (profileData.firstName) {
      return profileData.firstName.charAt(0).toUpperCase();
    } else if (profileData.email) {
      return profileData.email.charAt(0).toUpperCase();
    }
    return "👤";
  };

  const handleDashboardNavigation = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleBrowseInternshipsNavigation = (e) => {
    e.preventDefault();
    navigate('/browse-internships');
  };

  const getMissingSkills = (requiredSkills) => {
    return requiredSkills.filter(skill => 
      !profileData.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  const handleLaunchRecruiterView = () => {
    setShowRecruiterView(true);
  };

  const handleAddAISkill = (skill) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `🤖 AI suggestion: "${skill}" added to your skills!`,
        type: 'info'
      }]);
    }
  };

  const SmartNotifications = () => (
    <div className="smart-notifications">
      {notifications.slice(-3).map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );

  const RecruiterView = () => {
    const [animationStage, setAnimationStage] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimationStage(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearTimeout(timer);
    }, [animationStage]);

    const renderOverview = () => (
      <div className="recruiter-content">
        <div className="recruiter-metric pulse">
          <span>🚀 Profile Score</span>
          <div className="metric-value">92/100</div>
          <div className="score-meter">
            <div className="score-fill" style={{width: '92%'}}></div>
          </div>
          <span>Excellent - Top 15%</span>
        </div>

        <div className="interactive-stats">
          <div className="stat-item">
            <span>💼 Skill Match</span>
            <div className="stat-value">88%</div>
            <span>Industry Demand</span>
          </div>
          <div className="stat-item">
            <span>⚡ Response Rate</span>
            <div className="stat-value">42%</div>
            <span>Expected</span>
          </div>
          <div className="stat-item">
            <span>💰 Salary Range</span>
            <div className="stat-value">₹6-8L</div>
            <span>PA</span>
          </div>
          <div className="stat-item">
            <span>🏆 Market Rank</span>
            <div className="stat-value">Top 15%</div>
            <span>Among Peers</span>
          </div>
        </div>

        <div className="prediction-card">
          <h4>🎯 Hiring Prediction</h4>
          <div className="prediction-status">STRONG HIRE</div>
          <p>High probability of selection based on skill match and profile completeness</p>
        </div>
      </div>
    );

    const renderComparison = () => (
      <div className="recruiter-content">
        <h4>📊 Competitive Analysis</h4>
        
        <div className="comparison-chart">
          <div className="chart-bar-container">
            <div className="chart-bar user-bar" style={{height: '85%'}}></div>
            <div className="chart-label">You (85%)</div>
          </div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{height: '65%'}}></div>
            <div className="chart-label">Avg (65%)</div>
          </div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{height: '92%'}}></div>
            <div className="chart-label">Top 10%</div>
          </div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{height: '78%'}}></div>
            <div className="chart-label">Peers</div>
          </div>
        </div>

        <div className="prediction-card">
          <h4>🎯 Performance Insights</h4>
          <ul>
            <li>✅ 25% above average candidates</li>
            <li>✅ Strong technical skills foundation</li>
            <li>✅ Excellent profile completeness</li>
            <li>💡 Consider adding more projects</li>
          </ul>
        </div>
      </div>
    );

    const renderSkillsAnalysis = () => (
      <div className="recruiter-content">
        <h4>🔍 Skills Radar Analysis</h4>
        
        <div className="radar-chart">
          <div className="radar-grid"></div>
          <div className="radar-grid" style={{width: '80%', height: '80%', top: '10%', left: '10%'}}></div>
          <div className="radar-grid" style={{width: '60%', height: '60%', top: '20%', left: '20%'}}></div>
          
          <div className="radar-point" style={{top: '20%', left: '50%'}}></div>
          <div className="radar-point" style={{top: '50%', left: '80%'}}></div>
          <div className="radar-point" style={{top: '80%', left: '50%'}}></div>
          <div className="radar-point" style={{top: '50%', left: '20%'}}></div>
          <div className="radar-point" style={{top: '40%', left: '60%'}}></div>
          
          <div className="radar-line" style={{transform: 'rotate(0deg)'}}></div>
          <div className="radar-line" style={{transform: 'rotate(72deg)'}}></div>
          <div className="radar-line" style={{transform: 'rotate(144deg)'}}></div>
          <div className="radar-line" style={{transform: 'rotate(216deg)'}}></div>
          <div className="radar-line" style={{transform: 'rotate(288deg)'}}></div>
        </div>

        <div className="prediction-card">
          <h4>🎯 Skills Assessment</h4>
          <div className="interactive-stats">
            <div className="stat-item">
              <span>Technical</span>
              <div className="stat-value">85%</div>
            </div>
            <div className="stat-item">
              <span>Communication</span>
              <div className="stat-value">78%</div>
            </div>
            <div className="stat-item">
              <span>Projects</span>
              <div className="stat-value">70%</div>
            </div>
            <div className="stat-item">
              <span>Learning</span>
              <div className="stat-value">90%</div>
            </div>
          </div>
        </div>
      </div>
    );

    const renderHiringPredictor = () => (
      <div className="recruiter-content">
        <h4>🤖 AI Hiring Predictor</h4>
        
        <div className="recruiter-metric">
          <span>Probability of Selection</span>
          <div className="metric-value" style={{color: '#4ecdc4'}}>87%</div>
          <div className="score-meter">
            <div className="score-fill" style={{width: '87%', background: 'linear-gradient(90deg, #4ecdc4, #44a08d)'}}></div>
          </div>
        </div>

        <div className="prediction-card">
          <h4>📈 Prediction Factors</h4>
          <ul>
            <li>✅ Strong skill match with job requirements</li>
            <li>✅ Excellent profile completeness</li>
            <li>✅ Good academic background</li>
            <li>✅ Active learning attitude</li>
            <li>💡 Add 2-3 more projects</li>
          </ul>
        </div>

        <div className="interactive-stats">
          <div className="stat-item">
            <span>🚀 Timeline</span>
            <div className="stat-value">2-4 Weeks</div>
            <span>Expected Offer</span>
          </div>
          <div className="stat-item">
            <span>💼 Best Fit</span>
            <div className="stat-value">Startups</div>
            <span>MNCs</span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="recruiter-view-overlay">
        <div className="recruiter-view">
          <div className="recruiter-header">
            <h3>👨‍💼 Recruiter Dashboard</h3>
            <button onClick={() => setShowRecruiterView(false)}>×</button>
          </div>

          <div className="demo-controls">
            <button 
              className={`demo-control-btn ${recruiterViewTab === 'overview' ? 'active' : ''}`}
              onClick={() => setRecruiterViewTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`demo-control-btn ${recruiterViewTab === 'comparison' ? 'active' : ''}`}
              onClick={() => setRecruiterViewTab('comparison')}
            >
              ⚔️ Comparison
            </button>
            <button 
              className={`demo-control-btn ${recruiterViewTab === 'skills' ? 'active' : ''}`}
              onClick={() => setRecruiterViewTab('skills')}
            >
              🔍 Skills
            </button>
            <button 
              className={`demo-control-btn ${recruiterViewTab === 'predictor' ? 'active' : ''}`}
              onClick={() => setRecruiterViewTab('predictor')}
            >
              🤖 Predictor
            </button>
          </div>

          {recruiterViewTab === 'overview' && renderOverview()}
          {recruiterViewTab === 'comparison' && renderComparison()}
          {recruiterViewTab === 'skills' && renderSkillsAnalysis()}
          {recruiterViewTab === 'predictor' && renderHiringPredictor()}

          <div style={{textAlign: 'center', marginTop: '20px', opacity: '0.7', fontSize: '0.9em'}}>
            🔄 Live analysis - Auto updates every 3 seconds
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <SmartNotifications />
      {showRecruiterView && <RecruiterView />}

      <header className="dashboard-top-nav">
        <div className="nav-left">
          <h1>DISHAA</h1>
        </div>
        
        <div className="nav-center">
          <div className="search-bar">
            <input type="text" placeholder="Search internships..." />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        
        <div className="nav-right">
          <nav className="nav-links">
            <a href="#" className="nav-link" onClick={handleDashboardNavigation}>Dashboard</a>
            <a href="#" className="nav-link" onClick={handleBrowseInternshipsNavigation}>Browse Internships</a>
            <a href="#" className="nav-link active">My Profile</a>
            <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setShowFeedback(!showFeedback); }}>
              Feedback
            </a>
          </nav>
          <div className="nav-icons">
            <button className="icon-btn">🔔</button>
            <div className="profile-icon">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-icon-image" />
              ) : (
                <span className="profile-icon-initials">{getInitials()}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {showFeedback && (
        <div className="feedback-section">
          <div className="feedback-container">
            <div className="feedback-header">
              <h3>Share Your Feedback</h3>
              <button 
                className="feedback-close-btn"
                onClick={() => setShowFeedback(false)}
              >
                ×
              </button>
            </div>
            
            {feedbackSubmitted ? (
              <div className="feedback-success">
                <span className="success-icon">✅</span>
                <p>Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <div className="feedback-type-selector">
                  <label>Feedback Type:</label>
                  <div className="feedback-type-options">
                    <button
                      type="button"
                      className={`feedback-type-btn ${feedbackType === 'praise' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('praise')}
                    >
                      👍 Praise
                    </button>
                    <button
                      type="button"
                      className={`feedback-type-btn ${feedbackType === 'suggestion' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('suggestion')}
                    >
                      💡 Suggestion
                    </button>
                    <button
                      type="button"
                      className={`feedback-type-btn ${feedbackType === 'bug' ? 'active' : ''}`}
                      onClick={() => setFeedbackType('bug')}
                    >
                      🐛 Bug Report
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="feedback-text">Your Feedback:</label>
                  <textarea
                    id="feedback-text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Please share your thoughts, suggestions, or report any issues..."
                    rows="4"
                    required
                  />
                </div>
                
                <div className="feedback-actions">
                  <button
                    type="button"
                    className="feedback-cancel-btn"
                    onClick={() => setShowFeedback(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="feedback-submit-btn"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your profile information and preferences</p>
        </div>

        <div className="profile-completion-section">
          <h3>Profile Completion</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <span className="progress-text">{profileCompletion}% complete - Complete your profile to get better recommendations</span>
          </div>
        </div>

        <div className="profile-section ai-recommendations hover-glow">
          <div className="ai-header">
            <h3>🤖 AI-Powered Career Recommendations</h3>
            <span className="ai-badge">LIVE ANALYSIS</span>
          </div>
          <div className="ai-suggestions">
            <div className="ai-suggestion">
              <h4>🎯 Based on Your Skills</h4>
              <p>Frontend Developer roles match <strong>85%</strong> with your profile</p>
              <p>Expected Salary: ₹6-8 LPA</p>
              <button 
                className="demo-button"
                onClick={() => handleAddAISkill('React Native')}
                style={{marginTop: '10px', padding: '8px 16px', fontSize: '12px'}}
              >
                Add React Native
              </button>
            </div>
            <div className="ai-suggestion">
              <h4>🚀 Growth Opportunities</h4>
              <p>Learn <strong>React Native</strong> to increase job matches by 40%</p>
              <p>Add <strong>TypeScript</strong> for better opportunities</p>
              <button 
                className="demo-button"
                onClick={() => handleAddAISkill('TypeScript')}
                style={{marginTop: '10px', padding: '8px 16px', fontSize: '12px'}}
              >
                Add TypeScript
              </button>
            </div>
            <div className="ai-suggestion">
              <h4>📈 Market Trends</h4>
              <p>Your skills are in <strong>top 20%</strong> demand</p>
              <p>Remote opportunities: <strong>High</strong></p>
              <button 
                className="demo-button"
                onClick={() => handleAddAISkill('AWS')}
                style={{marginTop: '10px', padding: '8px 16px', fontSize: '12px'}}
              >
                Add AWS
              </button>
            </div>
          </div>
        </div>

        <div className="profile-section market-trends hover-glow">
          <div className="trends-header">
            <h3>📊 Real-time Market Trends</h3>
            <span className="trend-badge">LIVE DATA</span>
          </div>
          <div className="trends-grid">
            <div className="trend-item">
              <span>React Jobs</span>
              <div className="trend-value">+32%</div>
              <span>Growth this month</span>
            </div>
            <div className="trend-item">
              <span>Average Salary</span>
              <div className="trend-value">₹8.2L</div>
              <span>For your skills</span>
            </div>
            <div className="trend-item">
              <span>Remote Jobs</span>
              <div className="trend-value">{marketTrends.remoteJobs}</div>
              <span>Available now</span>
            </div>
            <div className="trend-item">
              <span>Hiring Companies</span>
              <div className="trend-value">{marketTrends.hiringCompanies}</div>
              <span>Active recruiters</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Achievements</h2>
            <span className="achievements-count">
              {Object.values(achievements).filter(a => a).length}/5 Badges Earned
            </span>
          </div>
          <p>Complete tasks to unlock special badges and showcase your progress</p>
          
          <div className="achievements-container">
            <div className={`achievement-badge ${achievements.profileCompleter ? 'earned' : 'locked'}`}>
              <span className="badge-icon">🏆</span>
              <span className="badge-name">Profile Completer</span>
              <span className="badge-desc">Complete 100% of your profile</span>
              {!achievements.profileCompleter && (
                <span className="badge-progress">{profileCompletion}% Complete</span>
              )}
            </div>
            
            <div className={`achievement-badge ${achievements.skillMaster ? 'earned' : 'locked'}`}>
              <span className="badge-icon">⭐</span>
              <span className="badge-name">Skill Master</span>
              <span className="badge-desc">Add 5+ skills to your profile</span>
              {!achievements.skillMaster && (
                <span className="badge-progress">{profileData.skills?.length || 0}/5 Skills</span>
              )}
            </div>
            
            <div className={`achievement-badge ${achievements.resumeReady ? 'earned' : 'locked'}`}>
              <span className="badge-icon">📄</span>
              <span className="badge-name">Resume Ready</span>
              <span className="badge-desc">Upload your resume</span>
              {!achievements.resumeReady && (
                <span className="badge-progress">Not Uploaded</span>
              )}
            </div>
            
            <div className={`achievement-badge ${achievements.socialButterfly ? 'earned' : 'locked'}`}>
              <span className="badge-icon">🦋</span>
              <span className="badge-name">Social Butterfly</span>
              <span className="badge-desc">Add at least one social link</span>
              {!achievements.socialButterfly && (
                <span className="badge-progress">No Social Links</span>
              )}
            </div>
            
            <div className={`achievement-badge ${achievements.detailOriented ? 'earned' : 'locked'}`}>
              <span className="badge-icon">📝</span>
              <span className="badge-name">Detail Oriented</span>
              <span className="badge-desc">Write 100+ characters in About section</span>
              {!achievements.detailOriented && (
                <span className="badge-progress">
                  {profileData.about ? `${profileData.about.length}/100 Characters` : 'Not Started'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section competitive-analysis hover-glow">
          <h3>🏆 Competitive Analysis</h3>
          <p>How you compare with other candidates in your field</p>
          
          <div className="analysis-chart">
            <div className="chart-bar user-bar" style={{height: '85%'}}>
              <div className="chart-label">You (85%)</div>
            </div>
            <div className="chart-bar" style={{height: '65%'}}>
              <div className="chart-label">Average (65%)</div>
            </div>
            <div className="chart-bar" style={{height: '92%'}}>
              <div className="chart-label">Top 10% (92%)</div>
            </div>
            <div className="chart-bar" style={{height: '78%'}}>
              <div className="chart-label">Peers (78%)</div>
            </div>
          </div>
        </div>

        <div className="performance-metrics">
          <div className="metric-card hover-glow">
            <span>Profile Strength</span>
            <div className="metric-value">{profileCompletion}%</div>
            <span className="metric-change">+5% this week</span>
          </div>
          <div className="metric-card hover-glow">
            <span>Skill Match</span>
            <div className="metric-value">87%</div>
            <span className="metric-change">Industry demand</span>
          </div>
          <div className="metric-card hover-glow">
            <span>Response Rate</span>
            <div className="metric-value">42%</div>
            <span className="metric-change">Expected</span>
          </div>
          <div className="metric-card hover-glow">
            <span>Market Rank</span>
            <div className="metric-value">Top 15%</div>
            <span className="metric-change">Among peers</span>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Skill Gap Analysis & Learning Roadmap</h2>
          </div>
          <p>Based on your current skills, here's what you're missing for popular internships. We'll help you bridge the gap!</p>
          
          <div className="skill-gap-container">
            <div className="skill-gap-item">
              <h4>🚀 Frontend Developer Intern</h4>
              <div className="required-skills">
                <span className="skill-label">Required Skills: </span>
                <span className="skill-tag">React</span>
                <span className="skill-tag">JavaScript</span>
                <span className="skill-tag">CSS</span>
                <span className="skill-tag">HTML</span>
              </div>
              
              <div className="missing-skills">
                <span className="skill-label">You're missing: </span>
                {!profileData.skills.some(skill => skill.toLowerCase().includes('html')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">HTML</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/BsDoLVMnmZs" target="_blank" rel="noopener noreferrer">HTML in 1 Hour - CodeWithHarry</a>
                        <a href="https://youtu.be/pQN-pnXPaVg" target="_blank" rel="noopener noreferrer">HTML Full Course - FreeCodeCamp</a>
                        <a href="https://youtu.be/HcOc7P5BMi4" target="_blank" rel="noopener noreferrer">HTML Tutorial - Apna College</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('react')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">React</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/bMknfKXIFA8" target="_blank" rel="noopener noreferrer">React Course - FreeCodeCamp</a>
                        <a href="https://youtu.be/tiLWCNFzThE" target="_blank" rel="noopener noreferrer">React in 1 Video - CodeWithHarry</a>
                        <a href="https://youtu.be/RGKi6LSPDLU" target="_blank" rel="noopener noreferrer">React Tutorial - Chai aur Code</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('javascript')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">JavaScript</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/hKB-YGF14SY" target="_blank" rel="noopener noreferrer">JavaScript - Apna College</a>
                        <a href="https://youtu.be/W6NZfCO5SIk" target="_blank" rel="noopener noreferrer">JavaScript Beginners - Programming with Mosh</a>
                        <a href="https://youtu.be/HgXQiI6fXhQ" target="_blank" rel="noopener noreferrer">JS in One Video - CodeWithHarry</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('css')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">CSS</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/Edsxf_NBFrw" target="_blank" rel="noopener noreferrer">CSS Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/1PnVor36_40" target="_blank" rel="noopener noreferrer">CSS in 1 Hour - FreeCodeCamp</a>
                        <a href="https://youtu.be/Ar0cig2aY4Y" target="_blank" rel="noopener noreferrer">CSS Complete Guide - Thapa Technical</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="skill-gap-item">
              <h4>📊 Data Science Intern</h4>
              <div className="required-skills">
                <span className="skill-label">Required Skills: </span>
                <span className="skill-tag">Python</span>
                <span className="skill-tag">Machine Learning</span>
                <span className="skill-tag">SQL</span>
                <span className="skill-tag">Data Analysis</span>
              </div>
              
              <div className="missing-skills">
                {!profileData.skills.some(skill => skill.toLowerCase().includes('python')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">Python</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/gfDE2a7MKjA" target="_blank" rel="noopener noreferrer">Python Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/_uQrJ0TkZlc" target="_blank" rel="noopener noreferrer">Python for Beginners - Mosh</a>
                        <a href="https://youtu.be/7wnove7K-ZQ" target="_blank" rel="noopener noreferrer">Python in 1 Video - Thapa Technical</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('machine learning')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">Machine Learning</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/GwIo3gDZCVQ" target="_blank" rel="noopener noreferrer">ML Tutorial - Krish Naik</a>
                        <a href="https://youtu.be/JcI5Vnw0b2c" target="_blank" rel="noopener noreferrer">ML for Beginners - CodeWithHarry</a>
                        <a href="https://youtu.be/ukzFI9rgwfU" target="_blank" rel="noopener noreferrer">ML in Python - NeuralNine</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('sql')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">SQL</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/7S_tz1z_5bA" target="_blank" rel="noopener noreferrer">SQL Tutorial - Apna College</a>
                        <a href="https://youtu.be/HXV3zeQKqGY" target="_blank" rel="noopener noreferrer">SQL Full Course - FreeCodeCamp</a>
                        <a href="https://youtu.be/pFq1pgli0OQ" target="_blank" rel="noopener noreferrer">SQL in 1 Video - CodeWithHarry</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('data analysis')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">Data Analysis</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/r-uOLxNrNk8" target="_blank" rel="noopener noreferrer">Data Analysis with Python - FreeCodeCamp</a>
                        <a href="https://youtu.be/daFfC_7gJDU" target="_blank" rel="noopener noreferrer">Data Analysis Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/-1Dm0PL_ykA" target="_blank" rel="noopener noreferrer">Pandas Tutorial - Krish Naik</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="skill-gap-item">
              <h4>⚙️ Backend Developer Intern</h4>
              <div className="required-skills">
                <span className="skill-label">Required Skills: </span>
                <span className="skill-tag">Node.js</span>
                <span className="skill-tag">MongoDB</span>
                <span className="skill-tag">Express.js</span>
                <span className="skill-tag">API Development</span>
              </div>
              
              <div className="missing-skills">
                {!profileData.skills.some(skill => skill.toLowerCase().includes('node')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">Node.js</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/BSO9C8Z-YV8" target="_blank" rel="noopener noreferrer">Node.js Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/Oe421EPjeBE" target="_blank" rel="noopener noreferrer">Node.js Full Course - FreeCodeCamp</a>
                        <a href="https://youtu.be/ldYcgPKEZC8" target="_blank" rel="noopener noreferrer">Node.js in 1 Video - Thapa Technical</a>
                      </div>
                    </div>
                  </div>
                )}
                
                {!profileData.skills.some(skill => skill.toLowerCase().includes('mongodb')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">MongoDB</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/9OPP_1eAENg" target="_blank" rel="noopener noreferrer">MongoDB Tutorial - FreeCodeCamp</a>
                        <a href="https://youtu.be/Y2Tuf3mzfw8" target="_blank" rel="noopener noreferrer">MongoDB with Node.js - CodeWithHarry</a>
                        <a href="https://youtu.be/WW3b1KmnvAg" target="_blank" rel="noopener noreferrer">MongoDB Complete Course - Thapa Technical</a>
                      </div>
                    </div>
                  </div>
                )}

                {!profileData.skills.some(skill => skill.toLowerCase().includes('express')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">Express.js</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/SccSCuHhOw0" target="_blank" rel="noopener noreferrer">Express.js Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/SBvmnHTQIPY" target="_blank" rel="noopener noreferrer">Express.js in 1 Video - Thapa Technical</a>
                        <a href="https://youtu.be/L72fhGm1tfE" target="_blank" rel="noopener noreferrer">Express.js Crash Course - Traversy Media</a>
                      </div>
                    </div>
                  </div>
                )}

                {!profileData.skills.some(skill => skill.toLowerCase().includes('api')) && (
                  <div className="missing-skill-with-roadmap">
                    <span className="missing-skill-tag">API Development</span>
                    <div className="learning-roadmap">
                      <strong>📹 YouTube Resources:</strong>
                      <div className="platform-links">
                        <a href="https://youtu.be/pKd0Rpw7O48" target="_blank" rel="noopener noreferrer">REST API Tutorial - CodeWithHarry</a>
                        <a href="https://youtu.be/fsCjFHuMXj0" target="_blank" rel="noopener noreferrer">API Development - FreeCodeCamp</a>
                        <a href="https://youtu.be/GZvSYJDk-us" target="_blank" rel="noopener noreferrer">REST API Concepts - Gaurav Sen</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="suggestion-box">
            <h4>🎯 Recommended Learning Strategy:</h4>
            <ul>
              <li><strong>Step 1:</strong> Watch YouTube tutorials (2-3 weeks per skill)</li>
              <li><strong>Step 2:</strong> Practice with small projects</li>
              <li><strong>Step 3:</strong> Build portfolio projects</li>
              <li><strong>Step 4:</strong> Add skills to profile and apply for internships</li>
            </ul>
            
            <div className="platform-recommendations">
              <h4>📚 Popular Indian YouTube Channels:</h4>
              <div className="platform-tags">
                <a href="https://www.youtube.com/@CodeWithHarry" target="_blank" rel="noopener noreferrer" className="platform-tag">CodeWithHarry</a>
                <a href="https://www.youtube.com/@ApnaCollegeOfficial" target="_blank" rel="noopener noreferrer" className="platform-tag">Apna College</a>
                <a href="https://www.youtube.com/@ThapaTechnical" target="_blank" rel="noopener noreferrer" className="platform-tag">Thapa Technical</a>
                <a href="https://www.youtube.com/@chaiaurcode" target="_blank" rel="noopener noreferrer" className="platform-tag">Chai aur Code</a>
                <a href="https://www.youtube.com/@CodingShuttle" target="_blank" rel="noopener noreferrer" className="platform-tag">Coding Shuttle</a>
                <a href="https://www.youtube.com/@Krishnaik06" target="_blank" rel="noopener noreferrer" className="platform-tag">Krish Naik</a>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section interactive-demo hover-glow">
          <h3>🎮 Interactive Recruiter Dashboard</h3>
          <p>Experience how recruiters analyze your profile in real-time with AI-powered insights</p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', margin: '20px 0'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3em'}}>👨‍💼</div>
              <h4>Recruiter View</h4>
              <p>See your profile through recruiter's eyes</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '3em'}}>🤖</div>
              <h4>AI Analysis</h4>
              <p>Real-time skills assessment</p>
            </div>
          </div>

          <button className="demo-button pulse" onClick={handleLaunchRecruiterView}>
            🚀 Launch Interactive Dashboard
          </button>
          
          <div style={{marginTop: '15px', fontSize: '0.9em', opacity: '0.8'}}>
            <strong>Features:</strong> Live scoring • Competitive analysis • Hiring prediction • Skills radar
          </div>
        </div>

        <div className="profile-sections">
          {/* Basic Information Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Basic Information</h2>
              {!isEditing ? (
                <button onClick={handleEditProfile} className="edit-btn">
                  Edit Profile
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
            
            <div className="profile-photo-section">
              <div className="profile-photo-container">
                {photoPreview ? (
                  <div className="profile-photo-preview">
                    <img src={photoPreview} alt="Profile" className="profile-photo" />
                    {isEditing && (
                      <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="profile-photo-placeholder">
                    <span>{getInitials()}</span>
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="photo-upload-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="change-photo-btn">
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <p className="photo-upload-note">Max 5MB • JPG, PNG, GIF</p>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="read-only-info">
                <div className="info-row">
                  <span className="info-label">First Name:</span>
                  <span className="info-value">{profileData.firstName || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Name:</span>
                  <span className="info-value">{profileData.lastName || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profileData.email || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profileData.phone || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{profileData.location || "Not specified"}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="profile-input-editable"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="profile-input-editable"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="profile-input-editable"
                      placeholder="your.email@example.com"
                    />
                </div>

                {/* <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="profile-input-editable"
                    placeholder="Enter Your Mob."
                  />
                </div> */}


<div className="form-group">
  <label>Phone Number</label>
  <input
    type="tel"
    name="phone"
    value={profileData.phone}
    onChange={handleInputChange}
    onKeyPress={(e) => {
      
      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
        e.preventDefault();
      }
    }}
    className="profile-input-editable"
    placeholder="+91 98765 43210" 
    pattern="[0-9]*" 
    maxLength="10" 
  />
</div>




                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="profile-input-editable"
                    placeholder="City, State"
                  />
                </div>
              </>
            )}
          </div>

          {/* Education Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Education</h2>
              {!isEditing && (
                <button onClick={handleEditProfile} className="edit-btn">
                  Edit
                </button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="read-only-info">
                <div className="info-row">
                  <span className="info-label">Degree:</span>
                  <span className="info-value">{profileData.education.degree || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">University:</span>
                  <span className="info-value">{profileData.education.university || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Year:</span>
                  <span className="info-value">{profileData.education.year}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">CGPA:</span>
                  <span className="info-value">{profileData.education.cgpa || "Not specified"}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Degree/Course</label>
                    <input
                      type="text"
                      name="degree"
                      value={profileData.education.degree}
                      onChange={handleEducationChange}
                      className="profile-input-editable"
                      placeholder="e.g., Bachelor of Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>College/University</label>
                    <input
                      type="text"
                      name="university"
                      value={profileData.education.university}
                      onChange={handleEducationChange}
                      className="profile-input-editable"
                      placeholder="e.g., Mumbai University"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year of Study</label>
                    <select
                      name="year"
                      value={profileData.education.year}
                      onChange={handleEducationChange}
                      className="profile-input-editable"
                    >
                      <option value="Select year">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>CGPA/Percentage</label>
                    <input
                      type="text"
                      name="cgpa"
                      value={profileData.education.cgpa}
                      onChange={handleEducationChange}
                      className="profile-input-editable"
                      placeholder="e.g., 8.5 or 85%"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Skills & Interests Section */}
          <div className="profile-section">
            <h2>Skills & Interests</h2>
            <p>Add skills that represent your abilities and interests</p>
            
            <div className="skills-container">
              {profileData.skills.map((skill, index) => (
                <div key={index} className="skill-tag green-bg">
                  {skill}
                  {isEditing && (
                    <button 
                      className="remove-skill"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {profileData.skills.length === 0 && !isEditing && (
                <div className="no-skills">No skills added yet</div>
              )}
            </div>

            {isEditing && (
              <div className="add-skill-section">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new skill (e.g., JavaScript, React)"
                  className="skill-input-editable"
                />
                <button onClick={handleAddSkill} className="add-skill-btn">
                  Add Skill
                </button>
              </div>
            )}
          </div>

          {/* About Me Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>About Me</h2>
              {!isEditing && (
                <button onClick={handleEditProfile} className="edit-btn">
                  Edit
                </button>
              )}
            </div>
            <p>Tell recruiters about yourself, your goals, and what you're looking for.</p>
            
            {!isEditing ? (
              <div className="read-only-about">
                <p>{profileData.about || "No information provided yet"}</p>
              </div>
            ) : (
              <textarea
                name="about"
                value={profileData.about}
                onChange={handleInputChange}
                className="about-textarea-editable"
                rows="5"
                placeholder="I'm a passionate student with interests in... I'm looking for opportunities to..."
              />
            )}
          </div>

          {/* Social Media Links Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Social Media Links</h2>
              {!isEditing && (
                <button onClick={handleEditProfile} className="edit-btn">
                  Edit
                </button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="read-only-info">
                <div className="info-row">
                  <span className="info-label">LinkedIn:</span>
                  <span className="info-value">{profileData.socialLinks?.linkedin || "Not provided"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">GitHub:</span>
                  <span className="info-value">{profileData.socialLinks?.github || "Not provided"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Portfolio:</span>
                  <span className="info-value">{profileData.socialLinks?.portfolio || "Not provided"}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profileData.socialLinks?.linkedin || ""}
                    onChange={handleSocialLinksChange}
                    className="profile-input-editable"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input
                    type="url"
                    name="github"
                    value={profileData.socialLinks?.github || ""}
                    onChange={handleSocialLinksChange}
                    className="profile-input-editable"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="form-group">
                  <label>Portfolio Website</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={profileData.socialLinks?.portfolio || ""}
                    onChange={handleSocialLinksChange}
                    className="profile-input-editable"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </>
            )}
          </div>

          {/* Resume Upload Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Resume</h2>
            </div>
            
            <div className="resume-upload-section">
              {profileData.resume ? (
                <div className="resume-uploaded">
                  <div className="resume-icon">📄</div>
                  <div className="resume-info">
                    <p className="resume-name">{profileData.resume.name}</p>
                    <p className="resume-size">{(profileData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button className="view-resume-btn" onClick={handleViewResume}>
                    View Resume
                  </button>
                  {isEditing && (
                    <button className="remove-resume-btn" onClick={handleRemoveResume}>
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <div className="resume-upload-placeholder">
                  <input
                    type="file"
                    ref={resumeInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    style={{ display: 'none' }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="upload-resume-btn">
                    📄 Upload Resume (PDF, DOC)
                  </label>
                  <p className="resume-upload-note">Max 5MB • PDF, DOC, DOCX files</p>
                </div>
              )}
            </div>
          </div>

          {/* Internship Preferences Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Internship Preferences</h2>
              {!isEditing && (
                <button onClick={handleEditProfile} className="edit-btn">
                  Edit
                </button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="read-only-info">
                <div className="info-row">
                  <span className="info-label">Sector:</span>
                  <span className="info-value">{profileData.preferences.sector || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{profileData.preferences.type || "Not specified"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{profileData.preferences.duration || "Not specified"}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Preferred Sector</label>
                  <select
                    name="sector"
                    value={profileData.preferences.sector}
                    onChange={handlePreferencesChange}
                    className="profile-input-editable"
                  >
                    <option value="">Select sector</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Internship Type</label>
                  <select
                    name="type"
                    value={profileData.preferences.type}
                    onChange={handlePreferencesChange}
                    className="profile-input-editable"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Duration</label>
                  <select
                    name="duration"
                    value={profileData.preferences.duration}
                    onChange={handlePreferencesChange}
                    className="profile-input-editable"
                  >
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button onClick={handleSaveProfile} className="save-profile-btn">
                Save Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
















