import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import "../styles/StoryPage.css";

const StoryPage = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [makingChoice, setMakingChoice] = useState(false);
  const [usageLimit, setUsageLimit] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const storyContentRef = useRef(null);
  const newContentRef = useRef(null);

  // Fetch story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError("");
        const storyData = await apiService.getStory(storyId);
        setStory(storyData);
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("Failed to load story. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Handle scroll detection for reading mode and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show scroll to top button when scrolled down
      setShowScrollToTop(scrollY > windowHeight * 0.5);

      // Enter reading mode when scrolled past header
      if (storyContentRef.current) {
        const storyRect = storyContentRef.current.getBoundingClientRect();
        setIsReading(storyRect.top < 100 && storyRect.bottom > 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to new content after choice
  useEffect(() => {
    if (newContentRef.current && !makingChoice) {
      setTimeout(() => {
        newContentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [story?.current_node_id, makingChoice]);

  // Handle making a choice
  const handleChoice = async (choiceId) => {
    if (makingChoice) return;

    try {
      setMakingChoice(true);
      setError("");
      setUsageLimit(false);

      // Make the choice
      const result = await apiService.makeChoice(storyId, choiceId);

      // Check if result is an error object (from our API service)
      if (result instanceof Error) {
        throw result;
      }

      setStory(result);
    } catch (error) {
      console.error("Error making choice:", error);

      // Check if this is a usage limit error
      if (
        error.message &&
        (error.message.includes("limit") ||
          error.message.includes("reached") ||
          error.message.includes("429"))
      ) {
        setUsageLimit(true);
        setError(error.message);
      } else {
        setError("Failed to process your choice. Please try again.");
      }
    } finally {
      setMakingChoice(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle reading mode manually
  const toggleReadingMode = () => {
    setIsReading(!isReading);
    // Add CSS class to body for distraction-free mode
    if (!isReading) {
      document.body.classList.add("reading-mode");
    } else {
      document.body.classList.remove("reading-mode");
    }
  };

  // Cleanup reading mode on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("reading-mode");
    };
  }, []);

  // Return to stories list
  const handleBack = () => {
    navigate("/stories");
  };

  // View story timeline
  const handleViewTimeline = () => {
    navigate(`/story/${storyId}/timeline`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !usageLimit) {
    return (
      <div className="story-error">
        <div className="error">{error}</div>
        <button className="btn" onClick={handleBack}>
          Back to Stories
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="story-error">
        <div className="error">Story not found.</div>
        <button className="btn" onClick={handleBack}>
          Back to Stories
        </button>
      </div>
    );
  }

  // Get current node safely
  const currentNode = story?.nodes?.[story.current_node_id];

  // If currentNode is not available, something is wrong with the story structure
  if (!currentNode) {
    return (
      <div className="story-error">
        <div className="error">Story data is corrupted or incomplete.</div>
        <button className="btn" onClick={handleBack}>
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className={`story-page ${isReading ? "reading-mode-active" : ""}`}>
      {/* Reading Mode Controls */}
      <div className="reading-controls">
        <button
          onClick={toggleReadingMode}
          className="reading-mode-toggle"
          title={isReading ? "Exit Reading Mode" : "Enter Reading Mode"}
        >
          {isReading ? "📖" : "🔍"}
        </button>

        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="scroll-to-top"
            title="Scroll to top"
          >
            ⬆️
          </button>
        )}
      </div>

      <div className="story-container">
        <div className="story-header">
          <h1 className="story-title">{story.title}</h1>

          <div className="character-info">
            <span className="info-badge">
              <span className="badge-icon">👤</span>
              {story.character_name}
            </span>
            <span className="info-badge">
              <span className="badge-icon">🌍</span>
              {story.setting}
            </span>
            {story.cultivation_stage && (
              <span className="info-badge">
                <span className="badge-icon">⚡</span>
                {story.cultivation_stage}
              </span>
            )}
          </div>

          <div className="story-controls">
            <button onClick={handleViewTimeline} className="timeline-button">
              📖 View Timeline
            </button>
            <button onClick={handleBack} className="back-button">
              ← Back to Stories
            </button>
          </div>
        </div>

        <div className="story-content-wrapper">
          <div ref={storyContentRef} className="story-content">
            <div ref={newContentRef}>{currentNode.content}</div>
          </div>
        </div>

        <div className="choices-section">
          {usageLimit ? (
            <div className="usage-limit-error">
              <h3 className="usage-limit-title">Usage Limit Reached</h3>
              <p className="usage-limit-message">{error}</p>
              <p className="usage-limit-info">
                We limit the number of story continuations to control API costs.
                Your story has been saved, and you can return to continue later.
              </p>
              <button className="btn btn-large" onClick={handleBack}>
                Save & Return to Stories
              </button>
            </div>
          ) : (
            <>
              <div className="choices-header">
                <h2 className="choices-title">What will you do?</h2>
                <p className="choices-subtitle">Choose your path forward...</p>
              </div>

              <div className="choices-container">
                {makingChoice ? (
                  <div className="loading-choices">
                    <div className="loading-animation">
                      <div className="spinner"></div>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    <p className="loading-text">Weaving your story...</p>
                    <p className="loading-subtext">
                      The AI is crafting your next chapter
                    </p>
                  </div>
                ) : (
                  <div className="choices-grid">
                    {currentNode.choices.map((choice, index) => (
                      <button
                        key={choice.id}
                        className={`choice-btn choice-${index + 1}`}
                        onClick={() => handleChoice(choice.id)}
                        disabled={makingChoice}
                      >
                        <span className="choice-number">{index + 1}</span>
                        <span className="choice-text">{choice.text}</span>
                        <span className="choice-arrow">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
