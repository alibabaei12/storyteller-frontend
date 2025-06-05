import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import "../styles/StoriesList.css";

const StoriesList = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiService.getStories();
        setStories(data);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setError("Failed to load stories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Handle continuing a story
  const handleContinueStory = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  // Handle viewing story timeline
  const handleViewTimeline = (storyId) => {
    navigate(`/story/${storyId}/timeline`);
  };

  // Handle deleting a story
  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    try {
      setDeletingId(storyId);
      await apiService.deleteStory(storyId);
      setStories(stories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
      setError("Failed to delete story. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="stories-list-page">
      <h2 className="page-title">Your Stories</h2>

      {error && <div className="error">{error}</div>}

      {stories.length === 0 ? (
        <div className="card empty-state">
          <p>You don't have any stories yet.</p>
          <button
            className="btn btn-accent"
            onClick={() => navigate("/new-story")}
          >
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="card story-card">
              <h3 className="story-card-title">{story.title}</h3>

              <div className="story-card-details">
                <div className="story-card-info">
                  <p>
                    <strong>Character:</strong> {story.character_name}
                  </p>
                  <p>
                    <strong>Setting:</strong> {story.setting}
                  </p>
                  {story.cultivation_stage && (
                    <p>
                      <strong>Cultivation:</strong> {story.cultivation_stage}
                    </p>
                  )}
                  <p className="story-date">
                    Last updated: {formatDate(story.last_updated)}
                  </p>
                </div>
              </div>

              <div className="story-card-actions">
                <button
                  className="btn btn-accent"
                  onClick={() => handleContinueStory(story.id)}
                >
                  Continue
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewTimeline(story.id)}
                >
                  📖 Timeline
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteStory(story.id)}
                  disabled={deletingId === story.id}
                >
                  {deletingId === story.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-actions">
        <button className="btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
        <button
          className="btn btn-accent"
          onClick={() => navigate("/new-story")}
        >
          Create New Story
        </button>
      </div>
    </div>
  );
};

export default StoriesList;
