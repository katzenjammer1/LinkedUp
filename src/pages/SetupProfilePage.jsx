import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { updateUserProfile, getUserProfile } from "../lib/userService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import { updateProfile } from "firebase/auth";
import { User, Calendar, MapPin, Heart, Activity, Camera } from "lucide-react";
import './SetupProfilePage.css';

const SetupProfilePage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Form state
  const [formData, setFormData] = useState({
    age: "",
    minAge: 18,
    maxAge: 30,
    availableDays: [],
    bio: "",
    interests: "",
    location: "",
    radius: 25,
    preferredActivities: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load existing profile data on component mount
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user) return;
      
      try {
        const result = await getUserProfile(user.uid);
        if (result.success && result.data) {
          const profile = result.data;
          
          setFormData({
            age: profile.age || "",
            minAge: profile.ageRange?.min || 18,
            maxAge: profile.ageRange?.max || 30,
            availableDays: profile.availableDays || [],
            bio: profile.bio || "",
            interests: Array.isArray(profile.interests) ? profile.interests.join(", ") : "",
            location: profile.location || "",
            radius: profile.maxDistance || 25,
            preferredActivities: Array.isArray(profile.preferredActivities) 
              ? profile.preferredActivities.join(", ") : "",
          });

          // Set profile picture preview if exists
          if (profile.photoURL) {
            setProfilePicPreview(profile.photoURL);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadExistingProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear message when user starts typing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("No user logged in.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("Saving profile...");
    setMessageType("info");

    try {
      let profilePicURL = null;
      
      // Upload profile picture if selected
      if (profilePic) {
        try {
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageRef, profilePic);
          profilePicURL = await getDownloadURL(storageRef);

          // Update Firebase auth profile
          await updateProfile(user, { photoURL: profilePicURL });
        } catch (err) {
          console.error("Error uploading profile picture:", err);
          setMessage("Failed to upload profile picture");
          setMessageType("error");
          return;
        }
      }

      // Prepare profile updates
      const updates = {
        age: parseInt(formData.age) || null,
        ageRange: { 
          min: parseInt(formData.minAge), 
          max: parseInt(formData.maxAge) 
        },
        availableDays: formData.availableDays,
        bio: formData.bio.trim(),
        interests: formData.interests
          .split(",")
          .map(i => i.trim())
          .filter(i => i.length > 0),
        location: formData.location.trim(),
        maxDistance: parseInt(formData.radius),
        preferredActivities: formData.preferredActivities
          .split(",")
          .map(a => a.trim())
          .filter(a => a.length > 0),
        photoURL: profilePicURL || profilePicPreview || null,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateUserProfile(user.uid, updates);

      if (result.success) {
        setMessage("Profile saved successfully! Redirecting to dashboard...");
        setMessageType("success");
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage(`Error: ${result.error}`);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage(`Error: ${error.message}`);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  if (initialLoading) {
    return (
      <div className="setup-profile-container">
        <div className="setup-profile-content">
          <div className="setup-profile-card">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-profile-container">
      <div className="setup-profile-content">
        <div className="setup-profile-card">
          {/* Header */}
          <div className="setup-profile-header">
            <h1 className="setup-profile-title">Setup Your Profile</h1>
            <p className="setup-profile-subtitle">
              Tell us about yourself to find the perfect matches
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`setup-profile-message ${messageType}`}>
              <span>{message}</span>
              <button
                onClick={clearMessage}
                className="message-close"
                aria-label="Clear message"
              >
                ×
              </button>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Profile Picture Section */}
            <div className="form-section">
              <h3 className="section-title">
                <Camera size={20} />
                Profile Picture
              </h3>
              <div className="file-input-container">
                <div className="file-input-wrapper">
                  <button
                    type="button"
                    className="file-input-button"
                    onClick={() => document.getElementById('profilePic').click()}
                  >
                    Choose Photo
                  </button>
                  <input
                    type="file"
                    id="profilePic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </div>
                {profilePicPreview && (
                  <img
                    src={profilePicPreview}
                    alt="Profile Preview"
                    className="profile-preview"
                  />
                )}
                {profilePic && (
                  <span className="file-name">{profilePic.name}</span>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <User size={20} />
                Basic Information
              </h3>
              <div className="form-row two-col">
                <div className="profile-form-group">
                  <label className="profile-form-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    placeholder="Enter your age"
                    className="profile-form-input"
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="profile-form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="profile-form-group">
                <label className="profile-form-label">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  className="profile-form-textarea"
                  rows={4}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="form-section">
              <h3 className="section-title">
                <Heart size={20} />
                Preferences
              </h3>
              <div className="form-row">
                <div className="profile-form-group">
                  <label className="profile-form-label">Age Range</label>
                  <div className="age-range-container">
                    <div className="form-row two-col">
                      <div>
                        <input
                          type="number"
                          name="minAge"
                          value={formData.minAge}
                          onChange={handleInputChange}
                          min="18"
                          max="100"
                          placeholder="Min age"
                          className="profile-form-input"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="maxAge"
                          value={formData.maxAge}
                          onChange={handleInputChange}
                          min="18"
                          max="100"
                          placeholder="Max age"
                          className="profile-form-input"
                        />
                      </div>
                    </div>
                    <div className="age-range-display">
                      {formData.minAge} - {formData.maxAge} years
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Maximum Distance</label>
                <div className="slider-container">
                  <input
                    type="range"
                    name="radius"
                    value={formData.radius}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="slider"
                  />
                  <div className="slider-value">{formData.radius} miles</div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="form-section">
              <h3 className="section-title">
                <Calendar size={20} />
                Availability
              </h3>
              <div className="profile-form-group">
                <label className="profile-form-label">Available Days</label>
                <div className="days-grid">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        id={day}
                        checked={formData.availableDays.includes(day)}
                        onChange={() => toggleDay(day)}
                      />
                      <label htmlFor={day} className="day-label">
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interests & Activities */}
            <div className="form-section">
              <h3 className="section-title">
                <Activity size={20} />
                Interests & Activities
              </h3>
              <div className="form-row">
                <div className="profile-form-group">
                  <label className="profile-form-label">Interests</label>
                  <div className="tags-input-container">
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      placeholder="Reading, hiking, cooking, photography..."
                      className="profile-form-input"
                    />
                    <div className="tags-input-help">
                      Separate interests with commas
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-form-label">Preferred Activities</label>
                <div className="tags-input-container">
                  <input
                    type="text"
                    name="preferredActivities"
                    value={formData.preferredActivities}
                    onChange={handleInputChange}
                    placeholder="Coffee dates, hiking, museums, concerts..."
                    className="profile-form-input"
                  />
                  <div className="tags-input-help">
                    Separate activities with commas
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Saving Profile...
                  </div>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupProfilePage;