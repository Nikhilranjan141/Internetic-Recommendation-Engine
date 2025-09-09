import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    }
  });

  const [newSkill, setNewSkill] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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
      // Check file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = () => {
    // Yahan aap photo upload logic add kar sakte hain
    if (profilePhoto) {
      // Photo upload API call yahan karenge
      console.log('Uploading photo:', profilePhoto);
      // Actual implementation ke liye:
      // await uploadPhotoToServer(profilePhoto);
    }
    
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

  // Generate initials from name
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
          </nav>
          <div className="nav-icons">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">👤</button>
          </div>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your profile information and preferences</p>
        </div>

        <div className="profile-completion-section">
          <h3>Profile Completion</h3>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: '25%'}}></div>
            </div>
            <span className="progress-text">25% complete - Complete your profile to get better recommendations</span>
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