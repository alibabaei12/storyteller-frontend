import React, { useEffect, useState } from "react";
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

  // Handle making a choice
  const handleChoice = async (choiceId) => {
    if (makingChoice) return;

    try {
      setMakingChoice(true);
      setError("");
      setUsageLimit(false);

      // Make the choice
      const updatedStory = await apiService.makeChoice(storyId, choiceId);
      setStory(updatedStory);

      // Scroll to top to show new content
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error making choice:", error);

      // Check if this is a usage limit error
      if (
        error.message.includes("limit") ||
        error.message.includes("reached")
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

  // Get current node
  const currentNode = story.nodes[story.current_node_id];

  return (
    <div className="story-page">
      <div className="card story-card">
        <h2 className="story-title">{story.title}</h2>

        <div className="character-info">
          <span className="info-badge">Character: {story.character_name}</span>
          <span className="info-badge">Setting: {story.setting}</span>
          {story.cultivation_stage && (
            <span className="info-badge">
              Cultivation: {story.cultivation_stage}
            </span>
          )}
        </div>

        <div className="story-controls">
          <button onClick={handleViewTimeline} className="timeline-button">
            📖 View Timeline
          </button>
        </div>

        <div className="story-content">{currentNode.content}</div>

        {usageLimit ? (
          <div className="usage-limit-error">
            <h3 className="usage-limit-title">Usage Limit Reached</h3>
            <p className="usage-limit-message">{error}</p>
            <p className="usage-limit-info">
              We limit the number of story continuations to control API costs.
              Your story has been saved, and you can return to continue later.
            </p>
            <button className="btn" onClick={handleBack}>
              Save & Return to Stories
            </button>
          </div>
        ) : (
          <>
            <h3 className="choices-title">What will you do?</h3>

            <div className="choices">
              {makingChoice ? (
                <div className="loading-choices">
                  <div className="spinner"></div>
                  <p>Generating story continuation...</p>
                </div>
              ) : (
                currentNode.choices.map((choice) => (
                  <button
                    key={choice.id}
                    className="choice-btn"
                    onClick={() => handleChoice(choice.id)}
                    disabled={makingChoice}
                  >
                    {choice.text}
                  </button>
                ))
              )}
            </div>

            <div className="story-actions">
              <button className="btn" onClick={handleBack}>
                Save & Return to Stories
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryPage;
