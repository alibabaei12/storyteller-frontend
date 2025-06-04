import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

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
          <button onClick={() => navigate("/new-story")} className="nav-btn">
            New Story
          </button>
          <button onClick={() => navigate("/stories")} className="nav-btn">
            My Stories
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
