import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { currentUser, userProfile, logout, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize form with user data
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setBio(userProfile.bio || "");
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Update profile in Firestore
      await updateProfile({
        displayName,
        bio,
      });

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(
        "Failed to update profile: " + (err.message || "Please try again")
      );
      console.error(err);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
      navigate("/login");
    } catch (err) {
      setError("Failed to log out: " + err.message);
    }
  };

  // Get first letter of display name or email for avatar placeholder
  const getInitial = () => {
    if (displayName && displayName.length > 0) {
      return displayName[0].toUpperCase();
    } else if (currentUser && currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="profile-avatar">
          {currentUser && currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">{getInitial()}</div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={currentUser ? currentUser.email : ""}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">About Me</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          <button type="submit" disabled={loading} className="profile-button">
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <div className="profile-stats">
          <h3>Your StoryTeller Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">
                {userProfile?.storiesCreated || 0}
              </div>
              <div className="stat-label">Stories Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {userProfile?.storiesCompleted || 0}
              </div>
              <div className="stat-label">Stories Completed</div>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
