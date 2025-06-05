import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import storytellerLogo from "../images/storytellerlogo.png";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState({ checked: false, online: false });
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await apiService.checkStatus();
        setApiStatus({ checked: true, online: true });
      } catch (error) {
        console.error("API Status Error:", error);
        setApiStatus({ checked: true, online: false });
        setError(
          "Failed to connect to the StoryTeller API server. Please make sure the server is running."
        );
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="home">
      {error && <div className="error">{error}</div>}

      <div className="hero-section">
        <div className="logo-container">
          <img
            src={storytellerLogo}
            alt="StoryTeller Logo"
            className="app-logo"
          />
        </div>

        <div className="welcome-content">
          <h1 className="hero-title">Welcome to StoryTeller</h1>
          <p className="hero-subtitle">
            Experience AI-generated interactive stories tailored to your
            choices. Create a unique character and embark on a personalized
            adventure.
          </p>
          <p className="hero-description">
            Explore fantasy worlds, cultivation realms, magical academies, and
            more!
          </p>

          <div className="action-buttons">
            <button
              className="btn btn-accent btn-large"
              onClick={() => navigate("/new-story")}
              disabled={!apiStatus.online}
            >
              <span className="btn-icon">✨</span>
              Start Your Adventure
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => navigate("/stories")}
              disabled={!apiStatus.online}
            >
              <span className="btn-icon">📚</span>
              My Stories
            </button>
          </div>

          <div className="try-demo-section">
            <p className="demo-text">
              New to interactive storytelling?{" "}
              <span className="demo-link" onClick={() => setShowDemo(true)}>
                Try a demo story
              </span>
            </p>
          </div>
        </div>
      </div>

      {!apiStatus.checked && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {apiStatus.checked && !apiStatus.online && (
        <div className="card api-status-card">
          <h3>API Server Offline</h3>
          <p>
            The StoryTeller API server appears to be offline. Please make sure
            it's running.
          </p>
          <p>To start the API server, run:</p>
          <pre>python storyteller-python/api_server.py</pre>
        </div>
      )}

      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Create your personalized adventure in just a few steps</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Your Character</h3>
            <p>
              Choose your character's name, gender, and background story. Pick
              from various settings like fantasy, sci-fi, or romance.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Generates Your Story</h3>
            <p>
              Our advanced AI creates a unique opening chapter tailored to your
              character and chosen setting.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Make Your Choices</h3>
            <p>
              At each turn, choose from multiple options that shape your story's
              direction and your character's fate.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Share Your Adventure</h3>
            <p>
              Share your completed stories with friends on social media and
              inspire others to create their own adventures.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-header">
          <h2>Why Choose StoryTeller?</h2>
          <p>Discover the features that make your adventure unique</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-container">
              <span className="feature-icon">🌟</span>
            </div>
            <h3>AI-Powered Stories</h3>
            <p>
              Experience unique, richly detailed stories generated by advanced
              AI technology that adapts to your choices.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <span className="feature-icon">🏯</span>
            </div>
            <h3>Multiple Settings</h3>
            <p>
              Explore cultivation worlds, fantasy realms, magical academies, and
              many other immersive environments.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <span className="feature-icon">👤</span>
            </div>
            <h3>Customizable Characters</h3>
            <p>
              Create your character with different origins, power systems, and
              backgrounds to shape your journey.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <span className="feature-icon">🔄</span>
            </div>
            <h3>Meaningful Choices</h3>
            <p>
              Your decisions shape the story and lead to different outcomes,
              creating a truly personalized experience.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="modal-overlay" onClick={() => setShowDemo(false)}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="demo-header">
              <h3>Try StoryTeller - Demo Story</h3>
              <button
                className="modal-close"
                onClick={() => setShowDemo(false)}
              >
                ×
              </button>
            </div>

            <div className="demo-content">
              <div className="demo-story-info">
                <h4>"Elena's Magical Academy Adventure"</h4>
                <p>
                  <strong>Character:</strong> Elena
                </p>
                <p>
                  <strong>Setting:</strong> Magical Academy
                </p>
                <p>
                  <strong>Progress:</strong> First Year Student
                </p>
              </div>

              <div className="demo-story-text">
                <p>
                  The ancient towers of Mystweave Academy pierce the morning
                  mist as you, Elena, approach the grand gates for the first
                  time. Your acceptance letter crinkles in your nervous grip as
                  other new students file past, some floating their luggage with
                  casual magic while others, like you, carry everything by hand.
                </p>
                <p>
                  The sorting ceremony awaits, and you've heard whispers that
                  your house placement will determine not just your dormitory,
                  but your entire magical education path...
                </p>
              </div>

              <div className="demo-choices">
                <h5>What do you do?</h5>
                <div className="demo-choice-buttons">
                  <button className="demo-choice">
                    Approach the confident-looking group of students discussing
                    magical theory
                  </button>
                  <button className="demo-choice">
                    Find a quiet spot to observe and learn from watching others
                  </button>
                  <button className="demo-choice">
                    Boldly walk up to the main entrance, ready to face whatever
                    comes
                  </button>
                </div>
              </div>

              <div className="demo-footer">
                <p>
                  This is just a preview! Create your account to start your own
                  personalized adventure.
                </p>
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    setShowDemo(false);
                    navigate("/signup");
                  }}
                >
                  Start My Adventure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
