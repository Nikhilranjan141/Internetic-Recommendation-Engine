import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

// Profile completion calculation function
const calculateProfileCompletion = (profileData) => {
  let completedFields = 0;
  let totalFields = 0;

  // Basic info fields (5 fields)
  const basicInfoFields = ['firstName', 'lastName', 'email', 'phone', 'location'];
  totalFields += basicInfoFields.length;
  completedFields += basicInfoFields.filter(field => 
    profileData[field] && profileData[field].toString().trim() !== ''
  ).length;

  // Education fields (4 fields)
  const educationFields = ['degree', 'university', 'year', 'cgpa'];
  totalFields += educationFields.length;
  completedFields += educationFields.filter(field => 
    profileData.education[field] && 
    profileData.education[field].toString().trim() !== '' && 
    profileData.education[field] !== 'Select year'
  ).length;

  // Skills (1 field - count as complete if at least one skill)
  totalFields += 1;
  if (profileData.skills && profileData.skills.length > 0) {
    completedFields += 1;
  }

  // About section (1 field)
  totalFields += 1;
  if (profileData.about && profileData.about.trim() !== '') {
    completedFields += 1;
  }

  // Preferences fields (3 fields)
  const preferenceFields = ['sector', 'type', 'duration'];
  totalFields += preferenceFields.length;
  completedFields += preferenceFields.filter(field => 
    profileData.preferences[field] && profileData.preferences[field].trim() !== ''
  ).length;

  // Social media fields (3 fields)
  const socialMediaFields = ['linkedin', 'github', 'portfolio'];
  totalFields += socialMediaFields.length;
  completedFields += socialMediaFields.filter(field => 
    profileData.socialLinks && profileData.socialLinks[field] && profileData.socialLinks[field].trim() !== ''
  ).length;

  // Resume field (1 field)
  totalFields += 1;
  if (profileData.resume) {
    completedFields += 1;
  }

  // Calculate percentage
  return Math.round((completedFields / totalFields) * 100);
};

// Achievement tracking function
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

  // Feedback system states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackType, setFeedbackType] = useState("suggestion");

  // Load profile data from localStorage on component mount
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
        
        // Check if resume data exists and create URL for viewing
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

    // Store user name in localStorage for other components to access
    if (user?.name) {
      localStorage.setItem('userName', user.name);
    }
  }, [user]);

  // Calculate profile completion and achievements whenever profileData changes
  useEffect(() => {
    const completion = calculateProfileCompletion(profileData);
    setProfileCompletion(completion);
    
    const newAchievements = checkAchievements(profileData, completion);
    setAchievements(newAchievements);
    
    // Store in localStorage
    localStorage.setItem('profileCompletion', completion.toString());
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('achievements', JSON.stringify(newAchievements));
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

      // Read the file and store it as ArrayBuffer for later retrieval
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
        
        // Create a URL for viewing the resume
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        setResumeUrl(url);
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
    
    // Clean up the URL object
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
    alert("Profile saved successfully!");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      // In a real app, you would send this to your backend
      console.log("Feedback submitted:", { type: feedbackType, message: feedback });
      setFeedbackSubmitted(true);
      setFeedback("");
      
      // Hide feedback section after 2 seconds
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

  return (
    <div className="profile-container">
      {/* Top Navigation Bar */}
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

      {/* Feedback Section */}
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

        {/* Profile Completion */}
        <div className="profile-completion-section">
          <h3>Profile Completion</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${profileCompletion}%`}}></div>
            </div>
            <span className="progress-text">{profileCompletion}% complete - Complete your profile to get better recommendations</span>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Achievements</h2>
            <span className="achievements-count">
              {Object.values(achievements).filter(a => a).length}/5 Badges Earned
            </span>
          </div>
          <p>Complete tasks to unlock special badges and showcase your progress</p>
          
          <div className="achievements-container">
            {/* Profile Completer Badge */}
            <div className={`achievement-badge ${achievements.profileCompleter ? 'earned' : 'locked'}`}>
              <span className="badge-icon">🏆</span>
              <span className="badge-name">Profile Completer</span>
              <span className="badge-desc">Complete 100% of your profile</span>
              {!achievements.profileCompleter && (
                <span className="badge-progress">{profileCompletion}% Complete</span>
              )}
            </div>
            
            {/* Skill Master Badge */}
            <div className={`achievement-badge ${achievements.skillMaster ? 'earned' : 'locked'}`}>
              <span className="badge-icon">⭐</span>
              <span className="badge-name">Skill Master</span>
              <span className="badge-desc">Add 5+ skills to your profile</span>
              {!achievements.skillMaster && (
                <span className="badge-progress">{profileData.skills?.length || 0}/5 Skills</span>
              )}
            </div>
            
            {/* Resume Ready Badge */}
            <div className={`achievement-badge ${achievements.resumeReady ? 'earned' : 'locked'}`}>
              <span className="badge-icon">📄</span>
              <span className="badge-name">Resume Ready</span>
              <span className="badge-desc">Upload your resume</span>
              {!achievements.resumeReady && (
                <span className="badge-progress">Not Uploaded</span>
              )}
            </div>
            
            {/* Social Butterfly Badge */}
            <div className={`achievement-badge ${achievements.socialButterfly ? 'earned' : 'locked'}`}>
              <span className="badge-icon">🦋</span>
              <span className="badge-name">Social Butterfly</span>
              <span className="badge-desc">Add at least one social link</span>
              {!achievements.socialButterfly && (
                <span className="badge-progress">No Social Links</span>
              )}
            </div>
            
            {/* Detail Oriented Badge */}
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


      {/* Skill Gap Analysis Section */}
<div className="profile-section">
  <div className="section-header">
    <h2>Skill Gap Analysis</h2>
  </div>
  <p>Based on your current skills, here's what you're missing for popular internships:</p>
  
  <div className="skill-gap-container">
    {/* Frontend Developer Internship */}
    <div className="skill-gap-item">
      <h4>Frontend Developer Intern</h4>
      <div className="required-skills">
        <span className="skill-label">Required: </span>
        <span className="skill-tag">React</span>
        <span className="skill-tag">JavaScript</span>
        <span className="skill-tag">CSS</span>
        <span className="skill-tag">HTML</span>
      </div>
      <div className="missing-skills">
        <span className="skill-label">You're missing: </span>
        {!profileData.skills.some(skill => skill.toLowerCase().includes('html')) && (
          <span className="missing-skill-tag">HTML</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('react')) && (
          <span className="missing-skill-tag">React</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('javascript')) && (
          <span className="missing-skill-tag">JavaScript</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('css')) && (
          <span className="missing-skill-tag">CSS</span>
        )}
      </div>
    </div>

    {/* Data Science Internship */}
    <div className="skill-gap-item">
      <h4>Data Science Intern</h4>
      <div className="required-skills">
        <span className="skill-label">Required: </span>
        <span className="skill-tag">Python</span>
        <span className="skill-tag">Machine Learning</span>
        <span className="skill-tag">SQL</span>
        <span className="skill-tag">Data Analysis</span>
      </div>
      <div className="missing-skills">
        <span className="skill-label">You're missing: </span>
        {!profileData.skills.some(skill => skill.toLowerCase().includes('python')) && (
          <span className="missing-skill-tag">Python</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('machine learning')) && (
          <span className="missing-skill-tag">Machine Learning</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('sql')) && (
          <span className="missing-skill-tag">SQL</span>
        )}
        {!profileData.skills.some(skill => skill.toLowerCase().includes('data analysis')) && (
          <span className="missing-skill-tag">Data Analysis</span>
        )}
      </div>
    </div>

    {/* Add more internship types as needed */}
  </div>
  
  <div className="suggestion-box">
    <p>💡 <strong>Tip:</strong> Add the missing skills to your profile to qualify for more internships!</p>
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
              // VIEW MODE - Display Only
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
              // EDIT MODE - Form Fields (FULLY EDITABLE)
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

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="profile-input-editable"
                    placeholder="+91 98765 43210"
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
              // VIEW MODE
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
              // EDIT MODE
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
              // EDIT MODE
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

          {/* Save Button */}
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