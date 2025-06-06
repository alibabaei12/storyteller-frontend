import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SharedStoryViewer.css";

const SharedStoryViewer = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  useEffect(() => {
    const fetchSharedStory = async () => {
      try {
        setLoading(true);
        setError("");

        // Base URL for the backend server (without /api path)
        const API_BASE_URL =
          process.env.REACT_APP_API_URL ||
          (window.location.hostname === "localhost"
            ? "http://localhost:5001"
            : "https://storyteller-backend-liry.onrender.com");

        const url = `${API_BASE_URL}/api/shared/${shareToken}`;
        console.log("Fetching shared story...");

        const response = await fetch(url);

        if (!response.ok) {
          let errorData = null;
          try {
            errorData = await response.json();
          } catch (e) {
            // Response might be HTML (404 page) instead of JSON
            console.error("Could not parse error response as JSON");
          }
          console.log("Error response:", errorData);

          if (response.status === 404) {
            setError("This story link is invalid or has been removed.");
          } else {
            setError("Failed to load the shared story.");
          }
          return;
        }

        const storyData = await response.json();
        console.log("Shared story loaded successfully");
        setStory(storyData);

        // Find the timeline path from initial node
        const timeline = getStoryTimeline(storyData);
        setCurrentNodeIndex(0);
      } catch (error) {
        console.error("Error loading shared story:", error);
        setError(
          "Failed to load the shared story. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchSharedStory();
    }
  }, [shareToken]);

  const getStoryTimeline = (storyData) => {
    if (!storyData?.nodes) return [];

    const timeline = [];

    // Start from initial node and follow the path of completed choices only
    let currentNode = storyData.nodes["initial"];
    if (currentNode) {
      timeline.push(currentNode);
    }

    // Follow the path through selected choices, but only show completed portions
    while (currentNode?.selected_choice_id) {
      // Find the next node that has this node as parent
      const nextNode = Object.values(storyData.nodes).find(
        (node) => node.parent_node_id === currentNode.id
      );

      if (nextNode) {
        // Only add nodes that have choices already made (completed parts)
        // Don't add the current active node where new choices could be made
        if (nextNode.selected_choice_id) {
          timeline.push(nextNode);
          currentNode = nextNode;
        } else {
          // This is the current active node - don't include it in public timeline
          break;
        }
      } else {
        break;
      }
    }

    return timeline;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="shared-story-viewer">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading shared story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-story-viewer">
        <div className="error-state">
          <div className="error-icon">😕</div>
          <h2>Story Not Found</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button className="btn btn-accent" onClick={() => navigate("/")}>
              ✨ Create Your Own Story
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="shared-story-viewer">
        <div className="error-state">
          <div className="error-icon">📚</div>
          <h2>Story Not Available</h2>
          <p>This story is not available for sharing.</p>
          <button className="btn btn-accent" onClick={() => navigate("/")}>
            Create Your Own Story
          </button>
        </div>
      </div>
    );
  }

  const timeline = getStoryTimeline(story);
  const currentNode = timeline[currentNodeIndex];

  return (
    <div className="shared-story-viewer">
      <div className="shared-story-header">
        <div className="story-meta">
          <h1 className="story-title">{story.title}</h1>
          <div className="story-details">
            <span className="story-detail">
              <strong>Character:</strong> {story.character_name}
            </span>
            <span className="story-detail">
              <strong>Setting:</strong> {story.setting}
            </span>
            <span className="story-detail">
              <strong>Genre:</strong> {story.tone}
            </span>
            <span className="story-detail">
              <strong>Created:</strong> {formatDate(story.last_updated)}
            </span>
          </div>
        </div>

        <div className="sharing-badge">
          <span className="badge-icon">📖</span>
          <span>Story Timeline</span>
        </div>
      </div>

      <div className="story-content">
        {timeline.length > 0 ? (
          <div className="story-timeline">
            <div className="timeline-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={() =>
                  setCurrentNodeIndex(Math.max(0, currentNodeIndex - 1))
                }
                disabled={currentNodeIndex === 0}
              >
                ← Previous
              </button>

              <div className="progress-indicator">
                <span className="progress-text">
                  Chapter {currentNodeIndex + 1} of {timeline.length}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        ((currentNodeIndex + 1) / timeline.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <button
                className="nav-btn next-btn"
                onClick={() =>
                  setCurrentNodeIndex(
                    Math.min(timeline.length - 1, currentNodeIndex + 1)
                  )
                }
                disabled={currentNodeIndex === timeline.length - 1}
              >
                Next →
              </button>
            </div>

            <div className="story-chapter">
              <div className="chapter-content">
                {currentNode?.content && (
                  <div
                    className="story-text"
                    dangerouslySetInnerHTML={{
                      __html: currentNode.content.replace(/\n/g, "<br>"),
                    }}
                  />
                )}
              </div>

              {currentNode?.selected_choice_id && (
                <div className="choice-taken">
                  <div className="choice-label">Choice made:</div>
                  <div className="choice-text">
                    {
                      currentNode.choices?.find(
                        (c) => c.id === currentNode.selected_choice_id
                      )?.text
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-story">
            <p>
              This story hasn't started yet - no completed chapters to show.
            </p>
            <p className="story-note">
              Only completed portions of the story are available in shared view.
            </p>
          </div>
        )}
      </div>

      <div className="shared-story-footer">
        <div className="call-to-action">
          <h3>Create Your Own Adventure!</h3>
          <p>
            Inspired by {story.character_name}'s {story.setting} journey? Create
            your own AI-powered interactive story where your choices shape the
            adventure.
          </p>
          <div className="cta-buttons">
            <button
              className="btn btn-accent btn-large"
              onClick={() => navigate("/signup")}
            >
              ✨ Start Your Story
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedStoryViewer;
