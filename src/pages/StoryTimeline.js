import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import "../styles/StoryTimeline.css";

const StoryTimeline = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [storyPath, setStoryPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        setError("");
        const storyData = await apiService.getStory(storyId);
        setStory(storyData);

        // Build the story path the user took
        const path = buildStoryPath(storyData);
        setStoryPath(path);
      } catch (error) {
        console.error("Error fetching story:", error);
        setError("Failed to load story timeline. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Build the path the user took through the story
  const buildStoryPath = (storyData) => {
    const path = [];
    const nodes = storyData.nodes;

    // Start from the initial node
    let currentNodeId = "initial";

    while (currentNodeId && nodes[currentNodeId]) {
      const node = nodes[currentNodeId];
      const pathItem = {
        node: node,
        nodeId: currentNodeId,
      };

      // Find the choice that was selected (if any)
      if (node.selected_choice_id) {
        const selectedChoice = node.choices.find(
          (choice) => choice.id === node.selected_choice_id
        );
        pathItem.selectedChoice = selectedChoice;

        // Find the next node (the one that has this node as parent)
        const nextNodeId = Object.keys(nodes).find(
          (nodeId) => nodes[nodeId].parent_node_id === currentNodeId
        );
        currentNodeId = nextNodeId;
      } else {
        // No choice selected yet, this is the end of the path
        currentNodeId = null;
      }

      path.push(pathItem);
    }

    return path;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatChapterDate = (timestamp, index) => {
    if (!timestamp) {
      // Generate a realistic progression for demo
      const baseDate = new Date();
      baseDate.setHours(baseDate.getHours() - index * 2); // Each chapter 2 hours apart
      return baseDate.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter out [CHOICES] section from story content
  const processContent = (content) => {
    if (!content) return "";

    // Check if [CHOICES] tag exists in the content
    const choicesIndex = content.indexOf("[CHOICES]");
    if (choicesIndex !== -1) {
      // Return only the content before the [CHOICES] tag
      content = content.substring(0, choicesIndex).trim();
    }

    // Filter out [EMOTIONAL DEPTH] sections
    const emotionalDepthIndex = content.indexOf("[EMOTIONAL DEPTH]");
    if (emotionalDepthIndex !== -1) {
      // Find the end of the [EMOTIONAL DEPTH] section
      const endIndex = content.indexOf("\n\n", emotionalDepthIndex);
      if (endIndex !== -1) {
        // Remove the [EMOTIONAL DEPTH] section
        content =
          content.substring(0, emotionalDepthIndex) +
          content.substring(endIndex);
      } else {
        // Just remove everything from [EMOTIONAL DEPTH] to the end if no clear ending
        content = content.substring(0, emotionalDepthIndex).trim();
      }
    }

    // Filter out [NEW CHARACTERS] sections if they exist
    const newCharactersIndex = content.indexOf("[NEW CHARACTERS]");
    if (newCharactersIndex !== -1) {
      const endNewCharactersIndex = content.indexOf(
        "[/NEW CHARACTERS]",
        newCharactersIndex
      );
      if (endNewCharactersIndex !== -1) {
        // Remove the section including the end tag
        content =
          content.substring(0, newCharactersIndex) +
          content.substring(endNewCharactersIndex + "[/NEW CHARACTERS]".length);
      } else {
        // Just remove from the start tag to the end if no end tag
        content = content.substring(0, newCharactersIndex).trim();
      }
    }

    return content.trim();
  };

  const handleBackToStory = () => {
    navigate(`/story/${storyId}`);
  };

  const handleBackToStories = () => {
    navigate("/stories");
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading story timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleBackToStories} className="btn primary">
          Back to Stories
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="error-container">
        <h2>Story Not Found</h2>
        <p>The requested story could not be found.</p>
        <button onClick={handleBackToStories} className="btn primary">
          Back to Stories
        </button>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h1>{story.title}</h1>
        <div className="story-meta">
          <p>
            <strong>Character:</strong> {story.character_name} (
            {story.character_gender})
          </p>
          <p>
            <strong>Setting:</strong> {story.setting}
          </p>
          <p>
            <strong>Created:</strong> {formatDate(story.last_updated)}
          </p>
          {story.cultivation_stage &&
            !["romance", "mystery", "horror", "slice-of-life"].includes(
              story.setting
            ) && (
              <p>
                <strong>Progress Level:</strong> {story.cultivation_stage}
              </p>
            )}
        </div>

        <div className="timeline-actions">
          <button onClick={handleBackToStory} className="btn secondary">
            Continue Story
          </button>
          <button onClick={handleBackToStories} className="btn primary">
            Back to Stories
          </button>
        </div>
      </div>

      <div className="timeline-content">
        <h2>Your Story Journey</h2>
        <p className="timeline-description">
          Here's the complete path you've taken through your story, including
          all the choices you made along the way.
        </p>

        {storyPath.length === 0 ? (
          <div className="empty-timeline">
            <p>No story content yet. Start your adventure!</p>
          </div>
        ) : (
          <div className="timeline-path">
            {storyPath.map((pathItem, index) => (
              <div
                key={pathItem.nodeId}
                className={`timeline-item timeline-item-${index}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="timeline-marker">
                  <div className="timeline-thumbnail">
                    <div className="chapter-number">{index + 1}</div>
                    <div className="chapter-icon">📖</div>
                  </div>
                  <div className="timeline-connector"></div>
                </div>

                <div className="timeline-content-item">
                  <div className="story-segment">
                    <div className="chapter-header">
                      <h3>Chapter {index + 1}</h3>
                      <div className="chapter-meta">
                        <span className="chapter-date">
                          Updated on:{" "}
                          {formatChapterDate(pathItem.node.timestamp, index)}
                        </span>
                      </div>
                    </div>
                    <div className="story-text">
                      {processContent(pathItem.node.content)}
                    </div>

                    {pathItem.selectedChoice && (
                      <div className="choice-made">
                        <h4>Your Choice:</h4>
                        <div className="selected-choice">
                          💫 {pathItem.selectedChoice.text}
                        </div>
                      </div>
                    )}

                    {!pathItem.selectedChoice &&
                      index === storyPath.length - 1 && (
                        <div className="current-choices">
                          <h4>Available Choices:</h4>
                          <div className="choices-list">
                            {pathItem.node.choices.map(
                              (choice, choiceIndex) => (
                                <div
                                  key={choice.id}
                                  className="available-choice"
                                >
                                  {choiceIndex + 1}. {choice.text}
                                </div>
                              )
                            )}
                          </div>
                          <p className="continue-hint">
                            <em>
                              Continue your story to make your next choice!
                            </em>
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryTimeline;
