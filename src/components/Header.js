import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close dropdown when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMenuOpen]);

  // Get first letter of display name or email for avatar placeholder
  const getInitial = () => {
    if (userProfile && userProfile.displayName) {
      return userProfile.displayName[0].toUpperCase();
    } else if (currentUser && currentUser.email) {
      return currentUser.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={() => navigate("/")}>
          StoryTeller
        </h1>
        <p className="header-subtitle">
          An AI-powered interactive fiction experience
        </p>

        <nav className="header-nav">
          <button onClick={() => navigate("/")} className="nav-btn">
            Home
          </button>

          {currentUser ? (
            <>
              <button
                onClick={() => navigate("/new-story")}
                className="nav-btn"
              >
                New Story
              </button>
              <button onClick={() => navigate("/stories")} className="nav-btn">
                My Stories
              </button>
              <div className="user-profile-menu" ref={dropdownRef}>
                <button
                  className="profile-button"
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                >
                  {userProfile && userProfile.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt="Profile"
                      className="profile-avatar-small"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {getInitial()}
                    </div>
                  )}
                </button>
                {isMenuOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-user-info">
                      <p>{userProfile?.displayName || currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="nav-btn">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="nav-btn">
                Sign Up
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
